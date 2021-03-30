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
  rename,
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
    modalType: null,
    editingDict: null,
  };

  componentWillMount() {
    this.getDicts();
    this.getCurrentDict();

    const { locale } = this.props;
    this.dictPage = locale.dictPage;
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
    this.setState({ modalVisible: true, modalType: 'add' });
  };

  handleSetCurrent = (dict) => {
    setCurrent({
      dict,
      onSuccess: () => {
        message.success(this.dictPage.setCurrentSuccessInfo);
        this.getCurrentDict();
      },
    });
  };

  handleRename = (dict) => {
    const { form } = this.props;

    form.setFieldsValue({
      name: dict.name,
    });

    this.setState({
      modalVisible: true,
      modalType: 'rename',
      editingDict: dict,
    });
  };

  handleRemove = (dict) => {
    const that = this;
    const { dicts, current } = this.state;
    const newDicts = dicts.filter(item => item.id!==dict.id);

    Modal.confirm({
      title: this.dictPage.removeDictWarning,
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
            message.success(that.dictPage.removeDictSuccessInfo);
            that.getDicts();
          },
        });
      },
      okText: this.dictPage.removeDictModalOK,
      cancelText: this.dictPage.modalCancel,
    });
  };

  addDict = (dict, dicts, current) => {
    dicts.push(dict);

    add({
      dicts,
      onSuccess: () => {
        message.success(this.dictPage.addDictSuccessInfo);
        this.setState({ modalVisible: false });
        this.getDicts();

        if (current === null) {
          setCurrent({
            dict,
            onSuccess: () => {
              message.success(this.dictPage.setCurrentSuccessInfo);
              this.getCurrentDict();
            },
          });
        }
      },
    });
  };

  renameDict = (dict, dicts, current) => {
    // 传进来的dict是已经修改过的
    const temp = dicts.map(item => {
      if (item.id === dict.id) {
        return dict;
      } else {
        return item;
      }
    });

    rename({
      dicts: temp,
      onSuccess: () => {
        message.success(this.dictPage.renameDictSuccessInfo);
        this.setState({ modalVisible: false });
        this.getDicts();

        if (current.id === dict.id) {
          setCurrent({
            dict,
            onSuccess: () => {
              this.getCurrentDict();
            },
          });
        }
      },
    });
  };

  handleModalOkClick  = (e) => {
    e.preventDefault();

    const {
      modalType,
      dicts,
      current,
    } = this.state;

    const { form } = this.props;

    form.validateFields((err, { name }) => {
      if (!err) {
        switch (modalType) {
          case 'add': {
            const dict = {
              id: `${new Date().getTime()}`,
              name,
            };

            this.addDict(dict, dicts, current);
          }
          break;

          case 'rename': {
            const { editingDict } = this.state;

            editingDict.name = name;
            this.renameDict(editingDict, dicts, current);
          }
          break;

          default:
            console.error("【/Dict/index.js】一定是代码出错了！要不不可能到这个switch分支里来！");
        }

        this.setState({ modalType: null, editingDict: null });
        form.resetFields();
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
          message.error(this.dictPage.wrongDictFormatWarning);
        }
      } catch (e) {
        message.error(this.dictPage.wrongDictFormatWarning);
      }
    });
    reader.readAsText(file);
  };

  render() {
    const { modalVisible, dicts, current } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

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
            { this.dictPage.createDict }
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
              { this.dictPage.importDict }
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
                        this.handleSetCurrent(item);
                      }}
                    >
                      { this.dictPage.setCurrentDict }
                    </List.Item>
                    <List.Item
                      onClick={ () => {
                        this.handleRename(item);
                      }}
                    >
                      { this.dictPage.renameDict }
                    </List.Item>
                    <List.Item
                      onClick={ () => this.handleSave(item) }
                    >
                      { this.dictPage.exportDict }
                    </List.Item>
                    <List.Item
                      onClick={ () => this.handleRemove(item) }
                    >
                      { this.dictPage.removeDict }
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
                    <span className="current">{ this.dictPage.currentDict }</span>
                  ) }
                </Card>
              </Popover>
            </Col>
          )) }
        </Row>

        <Modal
          title={ this.dictPage.createDictModalTitle }
          visible={ modalVisible }
          onOk={ this.handleModalOkClick }
          onCancel={ () => {
            this.setState({ modalVisible: false });
            this.getDicts();
            form.resetFields();
          }}
          okText={ this.dictPage.createDictModalOk }
          cancelText={ this.dictPage.modalCancel }
        >
          <Form onSubmit={ this.handleModalOkClick }>
            <Item>{getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: this.dictPage.nameWarning,
                }],
              })(
                <Input
                  size="large"
                  placeholder={ this.dictPage.namePlaceholder }
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

