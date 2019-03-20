import React, {
  PureComponent,
  Fragment,
} from 'react';
import {
  Col,
  Card,
  List,
  Button,
  Icon,
  Empty,
  Badge,
} from 'antd';
import { query } from '../../models/word';
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
    getCurrent(current => {
      if (current !== null) {
        query(current.id, words => {
          this.setState({ words });

          this.genNextIndex(words.length);
        });
      }

      this.setState({ current });
    });
  }

  genNextIndex = (length=null) => {
    if (length === null) {
      const { words } = this.state;

      length = words.length;
    }

    const randomIndex = parseInt(Math.random()*length, 10);

    this.setState({ index: randomIndex });
  };

  handleClick = () => {
    this.genNextIndex();
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
              onClick={this.handleClick}
            >
              <Icon type="thunderbolt" theme="filled" />
            </Button>
            <Card
              bordered
            >
              <h2>{ words[index].text }</h2>
              <h3>{ words[index].kana }</h3>
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
