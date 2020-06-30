import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

export class Checkout extends Component {
  state = {
    ingredients: null,
    price: 0
  };

  // Parse the ingredients to the Checkout component
  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = 0;
    // Each entry will have this format: ['salad','1']
    for (let param of query.entries()) {
      if (param[0] === 'price') {
        price = param[1];
      } else {
        // Then turn this into object format like below:
        ingredients[param[0]] = +param[1];
      }
    }
    this.setState({ ingredients: ingredients, price: price });
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    return (
      <div>
        <CheckSummary
          ingredients={this.state.ingredients}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route
          path={this.props.match.path + '/contact-data'}
          // Use render property instead of component because I want to pass the ingredients in this component to contact data.
          // Render property takes a method then output some jsx on the right side of the arrow and there I actually want to render the contactData element.
          // Use props property here & {...this.props} as we need to pass the history property to the ContactData.jsx
          render={props => (
            <ContactData
              ingredients={this.state.ingredients}
              price={this.state.price}
              {...this.props}
            />
          )}
        />
      </div>
    );
  }
}

export default Checkout;
