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
} from 'antd';
import { query, remove, update } from '../../models/word';
import { getCurrent as getCurrentDict } from '../../models/dict';
import ImgUploader from '../../components/ImgUploader';
import { getBase64 } from '../../utils/utils';
import './index.css';

const { Item } = List;
const { Group } = Button;

class Memorize extends PureComponent {
  state = {
    index: 0,
    words: [],
    current: null,
    uploaderShow: false,
    img: null,
  };

  componentWillMount() {
    this.getWords();
  }

  getWords = () => {
    getCurrentDict(current => {
      if (current !== null) {
        query(current.id, words => {
          this.setState({ words });

          this.genNextIndex(words.length);
        });
      }

      this.setState({ current });
    });
  };

  genNextIndex = (length=null) => {
    if (length === null) {
      const { words } = this.state;

      length = words.length;
    }

    const randomIndex = parseInt(Math.random()*length, 10);

    this.setState({ index: randomIndex });
  };

  handleNext = () => {
    this.genNextIndex();
  };

  handleRemove = (text) => {
    const that = this;
    const { words, current } = this.state;

    Modal.confirm({
      title: '真的要删除这个单词吗？',
      onOk() {
        const tmp = words.filter(item => item.text!==text);

        remove({
          dictId: current.id,
          words: tmp,
          onSuccess: () => {
            that.getWords();
          },
        })
      },
      okText: '是的',
      cancelText: '点错了',
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

  render() {
    const { index, words, current, uploaderShow, img } = this.state;

    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span: 12, offset: 6 }}
      >
        { current!==null && current.name && (
          <Badge
            status="processing"
            text={ `${current.name} (${words.length})` }
            className="current"
          />
        ) }
        { words.length > 0 && words[index] ? (
          <Fragment>
            <Button
              size="large"
              block
              type="primary"
              className="btn"
              htmlType="button"
              onClick={ this.handleNext }
            >
              <Icon type="thunderbolt" theme="filled" />
            </Button>
            <Card
              bordered
            >
              <Row>
                <Col span={ 16 }>
                  <h2>{ words[index].text }</h2>
                  <h3>{ words[index].kana }</h3>
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
                      onClick={ () => this.handleRemove(words[index].text) }
                    >
                      <Icon type="delete" />
                    </Button>
                  </Group>
                </Col>
              </Row>
              <List
                bordered
                dataSource={ words[index].interpres }
                renderItem={item => (
                  <Item
                    key={ item.id }
                  >
                    { item.text }
                  </Item>
                )}
              />
              { (words[index].media.type==='img' && words[index].media.content) && (
                <img
                  className="img"
                  src={ words[index].media.content }
                  alt="释义图片"
                />
              ) }
              { uploaderShow && (
                <Fragment>
                  <ImgUploader
                    className="uploader"
                    onImgChange={ this.handleImgChange }
                    onImgPaste={ this.handleImgPaste }
                    img={ img }
                  />
                  <Row gutter={ 8 }>
                    <Col span={ 12 }>
                      <Button
                        type="primary"
                        block
                        onClick={ () => this.handleAddImg(index) }
                      >
                        添加
                      </Button>
                    </Col>
                    <Col span={ 12 }>
                      <Button
                        block
                        onClick={ this.handleCancelAddImg }
                      >
                        取消
                      </Button>
                    </Col>
                  </Row>
                </Fragment>
              ) }
            </Card>
          </Fragment>
        ) : (
          <Empty
            description="还没有单词，请先创建辞书再添加单词"
          />
        ) }
      </Col>
    );
  }
}

export default Memorize;
