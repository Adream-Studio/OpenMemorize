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
              <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
            </CardBody>
            <CardImg
              width="100%"
              src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
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