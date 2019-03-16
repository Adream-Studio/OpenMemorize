import React, { PureComponent } from 'react';
import {
  Col,
  Card,
  Button,
  Form, 
  Input,
  Upload,
  Icon,
  Modal,
} from 'antd';
import { query, add } from '../../models/word';
import './index.css';

const { Item } = Form;
const { TextArea } = Input;

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
  state = {
    img: '',  
    words: [],
  };

  componentWillMount() {
    query(words => {
      this.setState({ words });
    });
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          text,
          kana,
          interpreKeys,
          interpre,
        } = values;
        const { img, words } = this.state;

        const interpreArr = [];
        for (let i = 0; i < interpre.length; i+=1) {
          interpreArr.push({
            id: interpreKeys[i],
            text: interpre[i],
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
        
        words.push(word);

        const { onMemorize } = this.props;
        add({
          words,
          onSuccess: () => {
            onMemorize();
          },
        })
      }
    });
  };

  handleImgChange = (info) => {
    if (info.fileList[info.fileList.length - 1].originFileObj) {
      getBase64(info.fileList[info.fileList.length - 1].originFileObj, img => {
        this.setState({
          img,
        });
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
  };

  clearForm = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState({ img: '' });
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
    const { getFieldDecorator } = this.props.form;
    const { form } = this.props;
    const { img } = this.state;

    form.getFieldDecorator('interpreKeys', { initialValue: [0] });

    const interpreKeys = form.getFieldValue('interpreKeys');
    const interpreItems = interpreKeys.map(key => (
      <Item
        key={ `item${key}` }
      >{getFieldDecorator(`interpre[${key}]`, {
          rules: [{
            required: true,
            message: '释义不能为空!',
          }],
        })(
          <TextArea
            key={`textArea-${key}`}
            autosize={{
              minRows: 2,
              maxRows: 4,
            }}
            size="large"
            placeholder="释义"
          />
        )}
        { interpreKeys.length > 1 && (
          <Button
            onClick={() => this.handleRemoveListItem(key)}
          >
            <Icon
              type="minus-circle-o"
              key={`removeBtn-${key}`}
            />
          </Button>
        ) }
      </Item>
    ));

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">添加图片</div>
      </div>
    );

    return (
      <Col
        xs={{ span:22, offset:1 }}
        md={{ span:12, offset:6 }}
        className={ this.props.className }
      >
        <Card
          bordered
        >
          <Form
            {...formItemLayout}
            onSubmit={ this.handleSubmit }
          >
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
            <Item>{getFieldDecorator('kana')(
                <Input
                  size="large"
                  placeholder="假名"
                />
              )}
            </Item>
            { interpreItems }
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
