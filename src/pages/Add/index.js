import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Form, 
  Input,
  Upload,
  Icon,
  Modal,
  message,
  Select,
} from 'antd';
import { query as queryDicts, getCurrent } from '../../models/dict';
import { query as queryWords, add } from '../../models/word';
import './index.css';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class Add extends PureComponent {
  constructor(props) {
    super(props);
    const { onRetrieve } = this.props;

    this.state = {
      img: onRetrieve().img,  
      dicts: [],
      current: null,
    };
  }

  componentWillMount() {
    queryDicts(dicts => {
      this.setState({ dicts });
    });

    getCurrent(current => {
      this.setState({ current });
    });
  }

  componentDidMount() {
    const { form, onRetrieve } = this.props;
    const { formData } = onRetrieve();

    if (formData !== null) {
      const { interpre, interpreKeys, ...rest } = formData;

      form.setFieldsValue(rest);
    }
  }

  prepareForm = (formData) => {
    const { form } = this.props;

    let interpres;
    if (formData !== null) {
      const { interpreKeys, interpre } = formData;
      interpres = interpreKeys.map((key, index) => ({
        key,
        value: interpre[key], 
      }));
    } else {
      interpres = [{
        key: 0,
        value: '',
      }];
    }

    form.getFieldDecorator('interpreKeys', { initialValue: interpres.map(i => i.key) });

    this.interpreItems = interpres.map(item => (
      <Item
        key={ `item${item.key}` }
      >
        <Row gutter={ 6 }>
          <Col
            span={ interpres.length>1 ? 20 : 24 }
          >
            {form.getFieldDecorator(`interpre[${item.key}]`, {
              initialValue: item.value,
              rules: [{
                required: true,
                message: '释义不能为空!',
              }],
            })(
              <TextArea
                key={`textArea-${item.key}`}
                autosize={{
                  minRows: 2,
                  maxRows: 4,
                }}
                size="large"
                placeholder="释义"
              />
            )}
            </Col>
            <Col span={ 4 }>
            { interpres.length>1 && (
              <Button
                type="primary"
                ghost
                onClick={() => this.handleRemoveListItem(item.key)}
              >
                <Icon
                  type="minus-circle-o"
                  key={`removeBtn-${item.key}`}
                />
              </Button>
            ) }
          </Col>
        </Row>
      </Item>
    ));
  };

  cache = (imgData=null) => {
    const { img: stateImg } = this.state;
    const { form, onCache } = this.props;
    
    const formData = form.getFieldsValue();

    const cache = {
      formData,
      img: (imgData===null) ? stateImg : imgData,
    };

    onCache(cache);
  };
  
  handleSubmit = (e) => {
    const that = this;

    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          text,
          kana,
          interpreKeys,
          interpre,
          dict,
        } = values;
        const { img } = this.state;

        const interpreArr = [];
        for (let i = 0; i < interpreKeys.length; i+=1) {
          interpreArr.push({
            id: interpreKeys[i],
            text: interpre[interpreKeys[i]],
          });
        }

        const word = {
          text,
          kana,
          interpres: interpreArr,
          media: {
            type: 'img',
            content: img,
          },
        };
        
        queryWords(dict, words => {
          words.push(word);

          add({
            dictId: dict,
            words,
            onSuccess: () => {
              message.success("添加成功！");
              that.clearForm();
            },
          });
        });
      }
    });
  };

  handleImgChange = (info) => {
    if (info.fileList[info.fileList.length - 1].originFileObj) {
      getBase64(info.fileList[info.fileList.length - 1].originFileObj, img => {
        this.setState({
          img,
        });

        this.cache(img);
      });
    }
  };

  handleAddListItem = () => {
    const { form } = this.props;
    const keyName = 'interpreKeys';

    const keys = form.getFieldValue(keyName);

    const nextKey = keys.length === 0 ? 0 : keys[keys.length - 1] + 1;
    const newKeys = keys.concat(nextKey);

    form.setFieldsValue({
      [keyName]: newKeys,
    });

    this.cache();
  };

  handleRemoveListItem = (key) => {
    const { form } = this.props;
    const keyName = 'interpreKeys';

    const keys = form.getFieldValue(keyName);

    if (keys.length > 1) {
      form.setFieldsValue({
        [keyName]: keys.filter(oldKey => oldKey !== key),
      });
    } else {
      return;
    }

    this.cache();
    // 实为刷新interpreKeys所用
  };

  clearForm = () => {
    const { form, onCache } = this.props;
    form.resetFields();

    this.setState({ img: '' });

    onCache({
      formData: null,
      img: null,
    });
  };

  handleCancel = () => {
    const that = this;

    Modal.confirm({
      title: '将会清空本次添加，是否继续？',
      onOk() {
        that.clearForm();
      },
      okText: '是',
      cancelText: '否',
    });
  };

  render() {
    const { onRetrieve } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { img, dicts, current } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">添加图片</div>
      </div>
    );

    this.prepareForm(onRetrieve().formData);
    
    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span:12, offset:6 }}
      >
        <Card
          bordered
        >
          <Form
            {...formItemLayout}
            onSubmit={ this.handleSubmit }
            onChange={ () => this.cache() }
          >
            <Item>
              {getFieldDecorator('dict', {
                rules: [{
                  required: true,
                  message: '请选择辞书，若没有请先去创建',
                }],
                initialValue: current ? current.id : '',
              })(
                <Select size="large" placeholder="选择辞书">
                  { dicts.map(item => (
                    <Option
                      key={ item.id }
                      value={ item.id }
                    >
                      { item.name }
                    </Option>
                  )) }
                </Select>
              )}
            </Item>
            <Item>{getFieldDecorator('text', {
                rules: [{
                  required: true,
                  message: '单词不能为空!',
                }],
              })(
                <Input
                  size="large"
                  placeholder="单词"
                />
              )}
            </Item>
            <Item>{getFieldDecorator('kana', {
              initialValue: '',
            })(
                <Input
                  size="large"
                  placeholder="假名/音标"
                />
              )}
            </Item>
            { this.interpreItems }
            <Item>
              <Button
                block
                onClick={ this.handleAddListItem }
              >
                <Icon type="plus" />
              </Button>
            </Item>
            <Item>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={ false }
              onChange={ this.handleImgChange }
              beforeUpload={ () => false }
            >
              {img ? <img width="100%" src={ img } alt="avatar" /> : uploadButton}
            </Upload>
            </Item>
          </Form>
          <Button
            size="large"
            className="btn"
            block
            type="primary"
            onClick={ this.handleSubmit }
          >
            添加
          </Button>
          <Button
            size="large"
            className="btn"
            block
            onClick={ this.handleCancel }
          >
            取消
          </Button>
        </Card>
      </Col>
    );
  }
}

export default Form.create()(Add);
