import React, { PureComponent } from 'react';
import {
  Col,
  Card,
  Row,
  Icon,
  Typography,
} from 'antd';
import './index.css';
import logo from '../../logo.png';

const { Paragraph } = Typography;

class Setting extends PureComponent {
  handleIssue = () => {
    window.location.replace('https://gitee.com/AdreamStudio/OpenMemorize/issues/');
  };

  handleSourceCode = () => {
    window.location.replace('https://gitee.com/AdreamStudio/OpenMemorize/');
  };

  handleDonate = () => {
    const { history } = this.props;

    history.push('/donate');
  };

  render() {
    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span: 12, offset: 6 }}
      >
        <Row gutter={ 1 }>
          <Col span={ 24 }>
            <Card
              bordered={ false }
            >
              <Col span={ 18 }>
                <Paragraph>Open Memorize - v1.1</Paragraph>
                <a
                  href="https://gitee.com/joenahm/codeMemo/blob/master/resume.md"
                  target="_blank"
                >
                  Joe Nahm
                </a>
                <Paragraph>
                  基于
                  <a
                    href="https://gitee.com/AdreamStudio/OpenMemorize/raw/master/LICENSE"
                    target="_blank"
                  >
                    GPLv3许可证
                  </a> 开源
                </Paragraph>
              </Col>
              <Col span={ 6 }>
                <img src={ logo } width="100%" alt="logo" />
              </Col>
            </Card>
          </Col>
          <Col span={ 8 }>
            <Card
              bordered={ false }
              className="card"
              onClick={ this.handleIssue }
            >
              <Icon type="question-circle" />
              <span className="text">问题反馈</span>
            </Card>
          </Col>
          <Col span={ 8 }>
            <Card
              bordered={ false }
              className="card"
              onClick={ this.handleSourceCode }
            >
              <Icon type="code" />
              <span className="text">源代码</span>
            </Card>
          </Col>
          <Col span={ 8 }>
            <Card
              bordered={false}
              className="card"
              onClick={ this.handleDonate }
            >
              <Icon type="like" />
              <span className="text">打赏作者</span>
            </Card>
          </Col> 
        </Row>
      </Col>
    );
  }
}

export default Setting;
