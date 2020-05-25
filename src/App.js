import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

export default class App extends Component {
  // The code added are for the testing purpose only. It just to prove the componentWillUnmount in withErrorHandler works. We will remove it late
  state = {
    show: true
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ show: false });
    }, 5000);
  }

  render() {
    return (
      <div>
        <Layout>{this.state.show ? <BurgerBuilder /> : null}</Layout>
      </div>
    );
  }
}
