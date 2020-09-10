import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from '../../axios-orders'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../components/withErrorHandler/withErrorHandler'
import * as burgerBuilderActions from '../../store/actions/index'

class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }
  // The goal is to initialize our ingredients in the state with the ingredients we stored on Firebase.
  // Before:
  //          state = {
  //                    salad: 0,
  //                    bacon: 0,
  //                    cheese: 0,
  //                    meat: 0
  //                  };
  // Now: state = {ingredients: null}

  componentDidMount() {
    console.log(this.props)
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((accu, el) => {
        return accu + el
      }, 0)
    return sum > 0
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true })
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  // Can get rid of this method as we want to use redux to manage Checkout & ContactData Containter.
  purchaseContinueHandler = () => {
    this.props.history.push('/checkout')
  }

  render() {
    const { ings, price } = this.props

    // Disable the button if the ingredients is less than 0. disableInfo helps to identify if we need to disable the button or not.
    const disableInfo = {
      ...ings
    }
    // We need disableInfo[key]=true/false. this check here: disableInfo[key] <= 0 will turn to true or false.
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }
    // disableInfo example: {salad: false, bacon: true, cheese: false, meat: true}

    let orderSummary = null

    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    )

    if (ings) {
      burger = (
        <Aux>
          <Burger ingredients={ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disableInfo}
            purchasable={this.updatePurchaseState(ings)}
            ordered={this.purchaseHandler}
            price={price}
          />
        </Aux>
      )
      orderSummary = (
        <OrderSummary
          ingredients={ings}
          price={price}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      )
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
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
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName =>
      dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: ingName =>
      dispatch(burgerBuilderActions.removeIngredient(ingName))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios))
