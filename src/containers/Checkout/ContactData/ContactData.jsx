import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  };

  orderHandler = event => {
    // This orderHandler is used on the button, and this button is inside a form. The default behavior is to send the request which reloads my form.
    // we don't want to send the request so we need to add the preventDefault, otherwise it will just reload the page.
    event.preventDefault();
    // Before adding the event.preventDefault(); the below clg shows nothing. After added, clg shows the right ingredients.
    console.log(this.props.ingredients);
    this.setState({
      loading: true
    });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Nicole Dong',
        address: {
          street: 'Teststreet 1',
          zipCode: '2121',
          country: 'Australia'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    };
    axios
      .post('/orders.json', order)
      .then(response => {
        this.setState({
          loading: false
        });
        // Use history.push method to redirect back to the root page. But there is no "history" object in the contactData page. So we need to pass it from Checkout.jsx. Or with withRouter to wrap the ContactData component.
        this.props.history.push('/');
      })
      .catch(error =>
        this.setState({
          loading: false
        })
      );
  };

  render() {
    let form = (
      <form>
        <Input inputtype="text" name="name" placeholder="Your Name" />
        <Input inputtype="email" name="email" placeholder="Your Email" />
        <Input inputtype="text" name="street" placeholder="Street" />
        <Input inputtype="text" name="postal" placeholder="Postal Code" />
        {/* Use orderHandler to make sure that when we click this button here, we do actually submit our order. */}
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
// export default withRouter(ContactData);
