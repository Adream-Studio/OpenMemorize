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
import { query, remove } from '../../models/word';
import { getCurrent } from '../../models/dict';
import './index.css';

const { Item } = List;

class Memorize extends PureComponent {
  state = {
    index: 0,
    words: [],
    current: null,
  };

  componentWillMount() {
    this.getWords();
  }

  getWords = () => {
    getCurrent(current => {
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

  render() {
    const { index, words, current } = this.state;

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
        { words.length > 0 ? (
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
                <Col span={ 20 }>
                  <h2>{ words[index].text }</h2>
                  <h3>{ words[index].kana }</h3>
                </Col>
                <Col span={ 4 } className="btnRightWrapper">
                  <Button
                    htmlType="button"
                    onClick={ () => this.handleRemove(words[index].text) }
                  >
                    <Icon type="delete" />
                  </Button>
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
            </Card>
          </Fragment>
        ) : (
          <Empty
            description="还没有单词呢，去添加一个？"
          />
        ) }
      </Col>
    );
  }
}

export default Memorize;
