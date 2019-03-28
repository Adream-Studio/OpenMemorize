import React, { PureComponent } from 'react';
import {
  Affix,
  Menu,
  Icon,
  Modal,
  Radio,
} from 'antd';
import {
  Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from "history";
import { get as getSetting, set as setSetting } from './models/setting';
import Memorize from './pages/Memorize';
import Add from './pages/Add';
import Dict from './pages/Dict';
import Setting from './pages/Setting';
import Donate from './pages/Donate';
import locales from './locale/config';
import './App.css';

const { Item } = Menu;
const RadioGroup = Radio.Group;

const history = createBrowserHistory();

export default class App extends PureComponent {
  state = {
    page: 'memorize',
    cache: {
      formData: null,
      img: null,
    },
    localeName: '',
    locale: locales[1],
    modalVisible: false,
    languageItems: null,
  };

  componentWillMount() {
    this.getSettings();
  }

  componentDidMount() {
    const { pathname } = history.location;

    this.setState({ page: pathname.slice(1) });
    // 让page随url变化

    const { localeName } = this.state;
    if (localeName === '') {
      console.log(locales);
    }
  }

  getSettings = () => {
    getSetting(setting => {
      this.setState({ localeName: setting.locale });
    });
  };

  handleRadioChange = e => {
    this.setState({
      locale: locales[e.target.value],
    });
  }

  handleMenuClick = (e) => {
    history.push(e.key);

    this.setState({ page: e.key });
  };

  handleCache = (cache) => {
    this.setState({ cache });
  };

  handleRetrieve = () => {
    const { cache } = this.state;

    return cache;
  };

  render() {
    const { page , locale, modalVisible } = this.state;
    const { appPage } = locale;

    return (
      <Router history={ history }>
        <div
          className="wrapper"
        >
          <Affix
            className="affix"
          >
            <Menu
              className="menu"
              onClick={this.handleMenuClick}
              selectedKeys={[page]}
              mode="horizontal"
            >
              <Item
                key="add"
              >
                <Icon type="plus-square" /> { appPage.add }
              </Item>
              <Item
                key="memorize"
              >
                <Icon type="thunderbolt" /> { appPage.memorize }
              </Item>
              <Item
                key="dict"
              >
                <Icon type="book" /> { appPage.dict }
              </Item>
              <Item
                key="setting"
              >
                <Icon type="setting" /> { appPage.setting }
              </Item>
            </Menu>
          </Affix>

          <Modal
            title={ appPage.languageModalTitle }
            visible={ modalVisible }
            onOk={ this.handleChangeLanguage }
            onCancel={ () => this.setState({ localeName: '', modalVisible: false }) }
            okText={ appPage.languageModalOk }
            cancelText={ appPage.languageModalCancel }
          >
            <RadioGroup
              onChange={ this.handleRadioChange }
            >
              { locales.slice(1).map((item, index) => (
                <Radio
                  key={ item.key }
                  value={ index+1 }
                >
                  { item.name }
                </Radio>
              )) }
            </RadioGroup>
          </Modal>

          <Route path="/" exact render={props => (
            <Redirect
              to={{
                pathname: '/memorize',
                state: { from: props.location },
              }}
            />
          )} />
          <Route
            path="/add"
            render={ props => (
              <Add
                onCache={ this.handleCache}
                onRetrieve={ this.handleRetrieve }
                locale={ locale }
                { ...props }
              />
            )}
          />
          <Route
            path="/memorize"
            render={ props => (
              <Memorize
                locale={ locale }
                { ...props }
              />
            )}
          />
          <Route
            path="/dict"
            render={ props => (
              <Dict
                locale={ locale }
                { ...props }
              />
            )}
          />
          <Route path="/setting" component={ Setting } />
          <Route path="/donate" component={Donate } />
        </div>
      </Router>
    );
  }
}
