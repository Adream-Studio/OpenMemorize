import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
} from 'antd';
import './index.css';

class Dict extends PureComponent {
  render() {
    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span:12, offset:6 }}
      >
        <Button
          type="primary"
          className="btn"
          ghost
          block
        >
          新建辞书
        </Button>
        <Row gutter={ 8 }>
          <Col span={ 12 }>
            <Card
              bordered
              className="dict"
            >
              日语N5词汇
            </Card>
          </Col>
          <Col span={ 12 }>
            <Card
              bordered
              className="dict"
            >
              英语专八词汇
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default Dict;

