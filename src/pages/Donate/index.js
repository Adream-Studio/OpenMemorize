import React, { PureComponent } from 'react';
import {
  Col,
  Card,
} from 'antd';
import wechat from '../../wechat.png';
import alipay from '../../alipay.jpg';
import './index.css';

class Donate extends PureComponent {
  render() {
    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span: 12, offset: 6 }}
      >
        <Card
          title="支付宝 Alipay"
          className="card"
        >
          <img
            src={ alipay }
            className="qrcode"
            alt="支付宝收款码"
          />
        </Card>
        <Card
          title="微信 WeChat"
          className="card"
        >
          <img
            src={ wechat }
            className="qrcode"
            alt="微信收款码"
          />
        </Card>
      </Col>
    );
  }
}

export default Donate;
