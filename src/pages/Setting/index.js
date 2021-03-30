import React, { PureComponent } from 'react';
import {
  Col,
  Card,
  Row,
  Icon,
  Typography,
  Radio,
  Modal,
} from 'antd';
import './index.css';
import logo from '../../logo.png';
import locales from "../../locale/config";

const { Paragraph } = Typography;
const RadioGroup = Radio.Group;

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
    const {
      locale,
      localeName,
      onChangeLanguage,
      onRadioChange,
      onLanguageClick,
      modalVisible,
    } = this.props;
    const { settingPage, appPage } = locale;

    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span: 12, offset: 6 }}
      >
        <Row gutter={ 4 }>
          <Col
            span={ 24 }
            style={{ marginBottom: '10px' }}
          >
            <Card
              bordered={ false }
            >
              <Col span={ 18 }>
                <Paragraph>Open Memorize - v1.4.0</Paragraph>
                <a
                  href="https://gitee.com/joenahm/codeMemo/blob/master/resume.md"
                  target="_blank"
                >
                  Joe Nahm
                </a>
                <Paragraph>
                  <a
                    href="https://gitee.com/AdreamStudio/OpenMemorize/raw/master/LICENSE"
                    target="_blank"
                  >
                    { settingPage.license }
                  </a>
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
              onClick={ onLanguageClick }
            >
              <Icon type="global" />
              <span className="text">{ settingPage.language }</span>
            </Card>
          </Col>
          <Col span={ 8 }>
            <Card
              bordered={ false }
              className="card"
              onClick={ this.handleSourceCode }
            >
              <Icon type="code" />
              <span className="text">{ settingPage.sourceCode }</span>
            </Card>
          </Col>
          <Col span={ 8 }>
            <Card
              bordered={false}
              className="card"
              onClick={ this.handleDonate }
            >
              <Icon type="like" />
              <span className="text">{ settingPage.donate }</span>
            </Card>
          </Col>
          <Col span={ 8 }>
            <Card
              bordered={ false }
              className="card"
              onClick={ this.handleIssue }
            >
              <Icon type="question-circle" />
              <span className="text">{ settingPage.feedback }</span>
            </Card>
          </Col>
        </Row>

        <Modal
          title={ appPage.languageModalTitle }
          visible={ modalVisible }
          onOk={ onChangeLanguage }
          onCancel={ () => this.setState({ localeName: '', modalVisible: false }) }
          okText={ appPage.languageModalOk }
          cancelText={ appPage.languageModalCancel }
        >
          <RadioGroup
            onChange={ onRadioChange }
            value={ localeName }
          >
            { locales.map(item => (
              <Radio
                key={ item.key }
                value={ item.key }
              >
                { item.name }
              </Radio>
            )) }
          </RadioGroup>
        </Modal>
      </Col>
    );
  }
}

export default Setting;
