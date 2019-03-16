import React, { PureComponent } from 'react';
import {
  Affix,
  Menu,
  Icon,
} from 'antd';
import Memorize from './pages/Memorize';
import Add from './pages/Add';
import './App.css';

const { Item } = Menu;

export default class App extends PureComponent {
  state = {
    page: 'memorize',
  };

  handleMenuClick = (e) => {
    this.setState({ page: e.key });
  };

  render() {
    const { page } = this.state;

    return (
      <div
        className="wrapper"
      >
        <Add
          className={ page==='add' ? 'show' : 'hide' }
        />
        <Memorize
          className={ page==='memorize' ? 'show': 'hide' }
        />
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
      </div>
    );
  }
}
