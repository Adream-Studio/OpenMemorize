import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Popover,
  List,
  message,
  Upload,
} from 'antd';
import {
  query,
  add,
  getCurrent,
  setCurrent,
  remove,
  save,
} from '../../models/dict';
import {
  query as queryWords,
  add as addWords,
} from '../../models/word';
import './index.css';

const { Item } = Form;
const { Group } =Button;

class Dict extends PureComponent {
  state = {
    dicts: [],
    current: null,
    modalVisible: false,
  };

  componentWillMount() {
    this.getDicts();
    this.getCurrentDict();
  };

  getDicts = () => {
    this.setState({ dicts: [] });
    // 防止过期数据累积
    query(dicts => {
      dicts.forEach(dict => {
        queryWords(dict.id, words => {
          const { dicts } = this.state;

          const tmp = dicts.map(item => item);
          dict.length = words.length;
          tmp.push(dict);

          this.setState({ dicts: tmp });
        });
      });
    });
  };

  getCurrentDict = () => {
    getCurrent(dict => {
      this.setState({ current: dict });
    });
  };

  handleAdd = () => {
    this.setState({ modalVisible: true });
  };

  handleSetCurrent = (dict) => {
    setCurrent({
      dict,
      onSuccess: () => {
        message.success("设置在背辞书成功！");
        this.getCurrentDict();
      },
    });
  };

  handleRemove = (dict) => {
    const that = this;
    const { dicts, current } = this.state;
    const newDicts = dicts.filter(item => item.id!==dict.id);
    
    Modal.confirm({
      title: '将会删除此辞书内所有单词，请三思！',
      onOk() {
        if (dict.id === current.id) {
          setCurrent({
            dict: {},
            onSuccess: () => {},
          });
        }

        remove({
          dicts: newDicts,
          dictId: dict.id,
          onSuccess: () => {
            message.success("辞书删除成功！");
            that.getDicts();
          },
        });
      },
      okText: '删除',
      cancelText: '取消',
    });
  };

  addDict = (dict, dicts, current) => {
    dicts.push(dict);

    add({
      dicts,
      onSuccess: () => {
        message.success("辞书添加成功！");
        this.setState({ modalVisible: false });
        this.getDicts();

        if (current === null) {
          setCurrent({
            dict,
            onSuccess: () => {
              message.success("设置在背辞书成功！");
              this.getCurrentDict();
            },
          });
        }
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, { name }) => {
      if (!err) {
        const dict = {
          id: `${new Date().getTime()}`,
          name,
        };

        const { dicts, current } = this.state;
        
        this.addDict(dict, dicts, current);
      }
    });
  };

  handleSave = (dict) => {
    queryWords(dict.id, words => {
      save({
        name: `${dict.name}.json`,
        content: JSON.stringify({
          dict,
          words,
        }),
      });
    });
  };

  handleFileChange = (info) => {
    const file = info.fileList[info.fileList.length - 1].originFileObj;
    const reader = new FileReader();
    const { dicts, current } = this.state;

    reader.addEventListener('load', () => {
      try {
        const dictionary = JSON.parse(reader.result);
        
        const { dict, words } = dictionary;

        if (dict!==null && words!==null) {
          this.addDict(dict, dicts, current);
          addWords({
            dictId: dict.id,
            words,
            onSuccess: () => {},
          });
        } else {
          message.error("辞书格式不正确，导入失败！");
        }
      } catch (e) {
        message.error("辞书格式不正确，导入失败！");
      }
    });
    reader.readAsText(file);
  };

  render() {
    const { modalVisible, dicts, current } = this.state;
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span:12, offset:6 }}
      >
        <Group
          className="btnGroup"
        >
          <Button
            type="primary"
            className="btn"
            ghost
            onClick={this.handleAdd}
          >
            新建辞书
        </Button>
          <Upload
            showUploadList={false}
            onChange={this.handleFileChange}
            beforeUpload={() => false}
          >
            <Button
              type="primary"
              className="upBtn"
              ghost
            >
              导入辞书
          </Button>
          </Upload>
        </Group>
        <Row gutter={ 8 }>
          { dicts.map(item => (
            <Col span={ 12 } key={ item.id }>
              <Popover
                trigger="click"
                overlayStyle={{ zIndex: '1' }}	
                content={
                  <List>
                    <List.Item
                      onClick={ () => {
                        this.setState({ popVisible: false });
                        this.handleSetCurrent(item);
                      }}
                    >
                      背它
                    </List.Item>
                    <List.Item
                      onClick={ () => this.handleSave(item) }
                    >
                      导出
                    </List.Item>
                    <List.Item
                      onClick={ () => this.handleRemove(item) }
                    >
                      删除
                    </List.Item>
                  </List>
                }
                placement="right"
              >
                <Card
                  bordered
                  className="dict"
                >
                  { item.name }
                  <span>{ item.length }</span>
                  { (current && item.id===current.id) && (
                    <span className="current">正在背</span>
                  ) }
                </Card>
              </Popover>
            </Col>
          )) }
        </Row>

        <Modal
          title="新建辞书"
          visible={ modalVisible }
          onOk={ this.handleSubmit }
          onCancel={ () => this.setState({ modalVisible: false }) }
          okText="确定"
          cancelText="取消"
        >
          <Form onSubmit={ this.handleSubmit }>
            <Item>{getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '名称不能为空!',
                }],
              })(
                <Input
                  size="large"
                  placeholder="名称"
                />
              )}
            </Item>
          </Form>
        </Modal>
      </Col>
    );
  }
}

export default Form.create()(Dict);

