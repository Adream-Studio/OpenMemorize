import React, { PureComponent } from 'react';
import {
  Affix,
  Menu,
  Icon,
} from 'antd';
import {
  Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from "history";
import Memorize from './pages/Memorize';
import Add from './pages/Add';
import Dict from './pages/Dict';
import './App.css';

const { Item } = Menu;

const history = createBrowserHistory();

export default class App extends PureComponent {
  state = {
    page: 'memorize',
    cache: {
      formData: null,
      img: null,
    },
  };

  componentDidMount() {
    const { pathname } = history.location;

    this.setState({ page: pathname.slice(1) });
    // 让page随url变化
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
    const { page } = this.state;

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
                <Icon type="plus-square" />加词
              </Item>
              <Item
                key="memorize"
              >
                <Icon type="thunderbolt" />背词
              </Item>
              <Item
                key="dict"
              >
                <Icon type="book" />辞书
              </Item>
              <Item
                key="setting"
              >
                <Icon type="setting" />设置
              </Item>
            </Menu>
          </Affix>

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
                { ...props }
              />
            )}
          />
          <Route path="/memorize" component={ Memorize } />
          <Route path="/dict" component={ Dict } />
        </div>
      </Router>
    );
  }
}
