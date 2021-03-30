import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Upload,
  Icon,
  Input,
} from 'antd';

const { Dragger } = Upload;
const { TextArea } = Input;

class ImgUploader extends PureComponent {
  render() {
    const {
      img,
      onImgChange,
      onImgPaste,
      locale,
      ...rest
    } = this.props;
    const { imgUploader } = locale;

    return (
      <div { ...rest }>
        <Row gutter={ 8 }>
          <Col span={ 12 }>
            <Dragger
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={ false }
              onChange={ onImgChange }
              beforeUpload={ () => false }
              id="uploader"
            >
              { img ? (
                <img width="100%" src={ img } alt="avatar" />
              ) : (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">{ imgUploader.uploaderTip } </div>
                </div>
              ) }
            </Dragger>
          </Col>
          <Col span={ 12 }>
            <TextArea
              style={{
                display: 'block',
                height: 85.33,
              }}
              placeholder={ imgUploader.pasteAreaTip }
              onPaste={ onImgPaste }
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default ImgUploader;
