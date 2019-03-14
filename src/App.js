import React, {
  PureComponent
} from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from 'reactstrap';
import './App.css';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <div className="container">
          <Card>
            <CardBody>
              <CardTitle>
                <h2>公園</h2>
              </CardTitle>
              <CardSubtitle>こうえん</CardSubtitle>
              <CardText>
                〔「公苑」と書く施設もある〕 主に市街地またはその周辺に設けられ、市民が休息したり散歩したりできる公共の庭園。
              </CardText>
              <CardText>
                〔「公苑」と書く施設もある〕 主に市街地またはその周辺に設けられ、市民が休息したり散歩したりできる公共の庭園。
              </CardText>
            </CardBody>
            <CardImg
              className="cardImg"
              src="https://weblio.hs.llnwd.net/e7/img/dict/hyazi/76thumb.png"
              alt="Card image cap"
            />
          </Card>
          <Button
            block
            className="btn"
          >
            下一个
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
