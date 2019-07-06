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
    locale: null,
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
  }

  getSettings = () => {
    getSetting(setting => {
      const localeFound = locales.find(item => item.key===setting.locale);
      this.setState({
        localeName: setting.locale==='' ? 'en' : setting.locale,
        locale: localeFound ? localeFound : locales[0],
      });

      if (setting.locale === '') {
        this.setState({ modalVisible: true });
      }
    });
  };

  handleRadioChange = e => {
    const key = e.target.value;
    this.setState({
      locale: locales.find(item => item.key===key),
      localeName: key,
    });
  };

  handleChangeLanguage = () => {
    const { locale } = this.state;

    setSetting({
      setting: {
        locale: locale.key,
      },
      onSuccess: () => {
        this.setState({ modalVisible: false });
        this.getSettings();
      },
    });
  };

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
    const { page , locale, modalVisible, localeName } = this.state;
    let appPage;
    if (locale !== null) {
      appPage = locale.appPage;
    }

    return (
      <Router history={ history }>
        { locale && appPage && (
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
                  className="tabItem"
                >
                  <Icon type="plus-square" />{ appPage.add }
                </Item>
                <Item
                  key="memorize"
                  className="tabItem"
                >
                  <Icon type="thunderbolt" />{ appPage.memorize }
                </Item>
                <Item
                  key="dict"
                  className="tabItem"
                >
                  <Icon type="book" />{ appPage.dict }
                </Item>
                <Item
                  key="setting"
                  className="tabItem"
                >
                  <Icon type="setting" />{ appPage.setting }
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
            <Route
              path="/setting"
              render={ props => (
                <Setting
                  locale={ locale }
                  onRadioChange={ this.handleRadioChange }
                  onChangeLanguage={ this.handleChangeLanguage }
                  onLanguageClick={ () => this.setState({ modalVisible: true }) }
                  visible={ modalVisible }
                  localeName={ localeName }
                  { ...props }
                />
              )}
            />
            <Route path="/donate" component={Donate } />
          </div>
        )}
      </Router>
    );
  }
}
