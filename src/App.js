import React, { PureComponent } from 'react';
import Memorize from './pages/Memorize';
import Add from './pages/Add';

export default class App extends PureComponent {
  state = {
    page: 'memorize',
  };

  handleAdd = () => {
    this.setState({ page: 'add' });
  };

  handleMemorize = () => {
    this.setState({ page: 'memorize' });
  };

  render() {
    const { page } = this.state;

    return (
      <div>
        { page === 'memorize' && (
          <Memorize onAdd={ this.handleAdd } />
        ) }
        { page === 'add' && (
          <Add onMemorize={ this.handleMemorize } />
        ) }
      </div>
    );
  }
}
