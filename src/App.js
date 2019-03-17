import React, { PureComponent } from 'react';
import {
  Affix,
  Menu,
  Icon,
} from 'antd';
import {
  Router,
  Route,
} from 'react-router-dom';
import { createBrowserHistory } from "history";
import Memorize from './pages/Memorize';
import Add from './pages/Add';
import './App.css';

const { Item } = Menu;

const history = createBrowserHistory();

export default class App extends PureComponent {
  state = {
    page: 'memorize',
  };

  handleMenuClick = (e) => {
    history.push(e.key);

    this.setState({ page: e.key });
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

        <Route path="/" exact component={ Memorize } />
        <Route path="/add" component={ Add } />
      </div>
      </Router>
    );
  }
}
