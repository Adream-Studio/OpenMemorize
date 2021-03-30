import React, {
  PureComponent,
  Fragment,
} from 'react';
import {
  Row,
  Col,
  Card,
  List,
  Button,
  Icon,
  Empty,
  Badge,
  Modal,
  Progress,
} from 'antd';
import { query, remove, update } from '../../models/word';
import { getCurrent as getCurrentDict } from '../../models/dict';
import {
  query as queryCountList,
  update as updateCountList,
  remove as removeCountListItem,
} from "../../models/count";
import ImgUploader from '../../components/ImgUploader';
import { getBase64 } from '../../utils/utils';
import './index.css';

const { Item } = List;
const { Group } = Button;

// @TODO 暂时先设置一个组长

const GRPLEN = 50;

class Memorize extends PureComponent {
  state = {
    index: 0,
    words: [],
    current: null,
    uploaderShow: false,
    img: null,
    memorized: [],
    group: [],
  };

  componentWillMount() {
    this.getWords();
  }

  getWords = () => {
    getCurrentDict(current => {
      if (current !== null) {
        query(current.id, words => {
          this.setState({ words });
          this.genGroup(words);
        });
      }

      this.setState({ current });
    });
  };

  genGroup = (words=null) => {
    if (words === null) {
      words = this.state.words;
    }

    getCurrentDict(current => {
      if (current !== null) {
        queryCountList(current.id, countList => {
          const list = countList.data;
          const group = [];

          // 对list进行随机化，防止背单词时枯燥
          let randomEnd = list.length;
          while (randomEnd > 0) {
            const index = parseInt(Math.random()*randomEnd, 10);

            const temp = list[randomEnd-1];
            list[randomEnd-1] = list[index];
            list[index] = temp;

            randomEnd -= 1;
          }

          const len = GRPLEN < list.length ? GRPLEN : list.length;
          for (let i = 0; i < len; i++) {
            let min = list[0];
            let index = 0;

            for (let j = 1; j < list.length; j++) {
              if (min.count > list[j].count) {
                min = list[j];
                index = j;
              }
            }

            group.push(words.find(item=> item.text===min.word));
            list.splice(index, 1);
          }

          this.setState({ group });
          this.genNextIndex(group.length);
        });
      }
    });
  };

  genNextIndex = (length=null) => {
    if (length === null) {
      const { group } = this.state;

      length = group.length;
    }

    const randomIndex = parseInt(Math.random()*length, 10);

    this.setState({ index: randomIndex });
    return randomIndex;
  };

  getRealLength = (arr) => {
    // 因为给下标赋值会造成此下边之前的值全是empty，所以要求真实的长度
    let count = 0;
    for (let _ in arr) {
      count += 1;
    }

    return count;
  };

  handleMemorize = (text) => {
    const { memorized, current } = this.state;

    memorized[text] = true;
    this.setState({ memorized });

    queryCountList(current.id, countList => {
      const newData = countList.data.map(item => {
        if (item.word === text) {
          return {
            word: text,
            count: item.count + 1,
          }
        } else {
          return item;
        }
      });

      updateCountList({
        dictId: current.id,
        data: newData,
      });
    });

    this.genNextIndex();
  };

  handleRemove = (text) => {
    const that = this;
    const { words, current } = this.state;
    const { locale } = this.props;
    const { memorizePage } = locale;

    Modal.confirm({
      title: memorizePage.deleteModalTitle,
      onOk() {
        const tmp = words.filter((word) => word.text!==text);

        remove({
          dictId: current.id,
          words: tmp,
          onSuccess: () => {
            that.getWords();
          },
        });

        removeCountListItem(current.id, text);
      },
      okText: memorizePage.deleteModalOk,
      cancelText: memorizePage.deleteModalCancel,
    });
  };

  handleUploadShow = () => {
    this.setState({ uploaderShow: true });
  };

  processImg = (img) => {
    this.setState({
      img,
    });
  };

  handleImgChange = (info) => {
    const file = info.fileList[info.fileList.length - 1].originFileObj;
    if (file) {
      getBase64(file, this.processImg);
    }
  };

  handleImgPaste = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const { items } = e.clipboardData;

      let status = true;
      for (let i = 0;
        status && (i < items.length);
        i+=1) {

        const item = items[i];

        if (item.kind === "file") {
            const file = item.getAsFile();

            getBase64(file, this.processImg);

            status = false;
        }
      }
    }
  };

  handleAddImg = (wordIndex) => {
    const { img, words, current } = this.state;

    const word = words[wordIndex];

    word.media.content = img;

    update({
      dictId: current.id,
      words,
      onSuccess: () => {
        this.setState({ uploaderShow: false, img: null });
      },
    });
  };

  handleCancelAddImg = () => {
    this.setState({
      img: null,
      uploaderShow: false,
    });
  };

  handleClear = () => {
    this.setState({
      memorized: [],
      group: [],
    });

    this.genGroup();
  };

  render() {
    const { locale } = this.props;
    const { memorizePage } = locale;
    const {
      index,
      words,
      current,
      uploaderShow,
      img,
      memorized,
      group,
    } = this.state;

    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span: 12, offset: 6 }}
      >
        { current!==null && current.name && (
          <div className="topWrapper">
            <Badge
              status="processing"
              text={ `${current.name} (${words.length})` }
              className="current"
            />
            <div className="progressWrapper">
              <Progress
                className="progress"
                status="active"
                default="small"
                percent={
                  parseFloat((this.getRealLength(memorized)/group.length*100).toFixed(1))
                }
                size="small"
              />
              <Button
                onClick={ this.handleClear }
                type="primary"
                size="small"
                ghost
              >
                { memorizePage.reset }
              </Button>
            </div>
          </div>
        ) }
        { group.length > 0 && group[index] ? (
          <Fragment>
            <Button
              size="large"
              block
              type="primary"
              className="btn"
              htmlType="button"
              onClick={ () => this.handleMemorize(group[index].text) }
            >
              <Icon type="thunderbolt" theme="filled" />
            </Button>
            <Card
              bordered
            >
              <Row>
                <Col span={ 16 }>
                  <h2>{ group[index].text }</h2>
                  <h3>{ group[index].kana }</h3>
                </Col>
                <Col span={ 8 } className="btnRightWrapper">
                  <Group>
                    <Button
                      htmlType="button"
                      onClick={ this.handleUploadShow }
                    >
                        <Icon type="picture" />
                      </Button>
                    <Button
                      htmlType="button"
                      onClick={ () => this.handleRemove(group[index].text) }
                    >
                      <Icon type="delete" />
                    </Button>
                  </Group>
                </Col>
              </Row>
              <List
                bordered
                dataSource={ group[index].interpres }
                renderItem={item => (
                  <Item
                    key={ item.id }
                  >
                    { item.text }
                  </Item>
                )}
              />
              { (group[index].media.type==='img' && group[index].media.content) && (
                <img
                  className="img"
                  src={ group[index].media.content }
                  alt="释义图片(interpretationImg)"
                />
              ) }
              { uploaderShow && (
                <Fragment>
                  <ImgUploader
                    className="uploader"
                    onImgChange={ this.handleImgChange }
                    onImgPaste={ this.handleImgPaste }
                    img={ img }
                    locale={ locale }
                  />
                  <Row gutter={ 8 }>
                    <Col span={ 12 }>
                      <Button
                        type="primary"
                        block
                        onClick={ () => this.handleAddImg(index) }
                      >
                        { memorizePage.uploadAdd }
                      </Button>
                    </Col>
                    <Col span={ 12 }>
                      <Button
                        block
                        onClick={ this.handleCancelAddImg }
                      >
                        { memorizePage.uploadCancel }
                      </Button>
                    </Col>
                  </Row>
                </Fragment>
              ) }
            </Card>
          </Fragment>
        ) : (
          <Empty
            description={ memorizePage.emptyTip }
          />
        ) }
      </Col>
    );
  }
}

export default Memorize;
