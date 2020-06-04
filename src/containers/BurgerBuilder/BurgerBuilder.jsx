import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

// This constant is created outside the class. I make the variable name all in caps with an _ in between each word because I want to make it a global const. It's also a JS object.
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    console.log(this.props);
    axios
      .get('https://react-my-burger-b5370.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((accu, el) => {
        return accu + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updateIngredients = {
      ...this.state.ingredients
    };
    updateIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredients
    });
    this.updatePurchaseState(updateIngredients);
  };

  removeIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    // Prevent error if the ingredients is less than 0.
    if (oldCount <= 0) return;
    const updatedCount = oldCount - 1;
    const updateIngredients = {
      ...this.state.ingredients
    };
    updateIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredients
    });
    this.updatePurchaseState(updateIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // this.setState({
    //   loading: true
    // });
    // // alert('You continue!');
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Nicole Dong',
    //     address: {
    //       street: 'Teststreet 1',
    //       zipCode: '2121',
    //       country: 'Australia'
    //     },
    //     email: 'test@test.com'
    //   },
    //   deliveryMethod: 'fastest'
    // };
    // axios
    //   .post('/orders.json', order)
    //   .then(response =>
    //     this.setState({
    //       loading: false,
    //       purchasing: false
    //     })
    //   )
    //   .catch(error =>
    //     this.setState({
    //       loading: false,
    //       purchasing: false
    //     })
    //   );

    // This push prop which allows us to basically switch the page and push a new page onto that stack of pages.
    this.props.history.push('/checkout');
  };

  render() {
    // Disable the button if the ingredients is less than 0. disableInfo helps to identify if we need to disable the button or not.
    const disableInfo = {
      ...this.state.ingredients
    };
    // We need disableInfo[key]=true/false. this check here: disableInfo[key] <= 0 will turn to true or false.
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0;
    }
    // disableInfo example: {salad: false, bacon: true, cheese: false, meat: true}

    let orderSummary = null;

    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disableInfo}
            purchasable={!this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
