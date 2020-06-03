import React, { Component } from 'react';

import CheckSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

export class Checkout extends Component {
  state = {
    ingredients: {
      salad: 1,
      meat: 1,
      cheese: 1,
      bacon: 1
    }
  };
  render() {
    return (
      <div>
        <CheckSummary ingredients={this.state.ingredients} />
      </div>
    );
  }
}

export default Checkout;
