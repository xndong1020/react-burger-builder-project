# Creating The Order Summary Modal

Now we want to make it so that when we **click on** the **Order Now button**, it **opens** an **Order Summary Modal**. For that we need a `modal`, a `backdrop`, and we need to show an `order summary`.

So we'll create a new `UI` **directory** in the `components` **directory** which will hold our `Modal Component`. So in `UI` we create a new `Modal` **directory** and within that a new `Modal.js` file. We also need a `backdrop` so we'll create a `Backdrop` **directory** in `UI` as well. we're **not adding** `Backdrop` to `Modal` because we **might re-use it** in other places in the application.

Now let's **start creating** the `Modal`. What should it look like? It should be a `functional` **Component**. It **doesn't have** any `state` attached to it. It just **receives** some `props` and **returns** some `JSX`.

```jsx
// Modal.js

import React from 'react';

const modal = (props) => (

);

export default modal;
```

And what should the **returned** `JSX` look like?

```jsx
// Modal.js

const modal = (props) => (
    <div>
        {props.children}
    </div>
);
```

`{props.children}` can be anything. And the `wrapping div` should receive some styling. -> `Modal.css`.

Next let's add this `Modal`. And we should add it in the place where we want to show it. -> `BurgerBuilder`.

```jsx
// BurgerBuilder.js

return (
    <Aux>
        <Modal />
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls ingredientAdded={this.addIngredientHandler}
        ingredientRemoved={this.removeIngredientHandler} disabled={disabledInfo}
        purchasable={this.state.purchasable}
        price={this.state.totalPrice}
        />
    </Aux>
)
```

The **goal** with the `Modal` is to **show** the `Order Summary`. The thing is that the `BurgerBuilder` file is **getting** quite **large**. So we **don't want to add the logic** to transform the ingredients array into a nicely structured summary in `BurgerBuilder`. we'll **outsource it** into its own **Component**.

We'll create a **new** `directory` within **Burger** `directory` and call it **OrderSummary**. -> `OrderSummary.js`.

```jsx
import React from 'react';

const orderSummary = (props) => {

}

export default orderSummary;
```

How should we **output** the `orderSummary`? -> We want to have a `title`, a short amount of `text`, a `list of all the items` in the order, and the `price`. Then `maybe a question` like "Continue to checkout?" and then `some buttons`.

We **don't need** a `wrapping div` here, so we can`import Aux`.

```jsx
const orderSummary = (props) => {
    const ingredientSummary = props.ingredients
    return (
        <Aux>
            <h3>Your order</h3>
            <p> A delicious burger with the following ingredients:</p>
            <ul>

            </ul>
        </Aux>
    )
}
```

We want to create our ul dynamically, so we can create a new `const ingredientSummary`, which **should take some ingredients** we expect to get as `props` and `map` them into `list items`. And we expect to **get our ingredients** in an `object` format. We also want to have a list item where we can display a name like Salad and the number of ingredients of that type.

Again we can use `Object.keys(props.ingredients)`. This will **transform** `props.ingredients` into an **array of keys** like Salad, etc.

```jsx
const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients);
    <li>Salad: 1</li>
    return (
        <Aux>
            <h3>Your order</h3>
            <p> A delicious burger with the following ingredients:</p>
            <ul>

            </ul>
        </Aux>
    )
}
```

Then we can map over the ingredientSummary and return a list of ingredients and their amounts.

```jsx
const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(ingKey => {
            return <li><span style={{textTransform: 'capitalize'}}>{ingKey}</span>: {props.ingredients[ingKey]}</li>
        });
```

Then we can **output**`ingredientSummary` inside of the `ul`.

```jsx
const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(ingKey => {
            return <li><span style={{textTransform: 'capitalize'}}>{ingKey}</span>: {props.ingredients[ingKey]}</li>
        });
    return (
        <Aux>
            <h3>Your order</h3>
            <p> A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Continue to Checkout?</p>
        </Aux>
    )
}
```

We won't style anything in ``. We will use the **default styles**.

Next let's use `const orderSummary` in the `BurgerBuilder`. We wan to pass it **between** our `Modal` `opening` and `closing` **tags**.

```jsx
// BurgerBuilder.js

return (
    <Aux>
        <Modal>
            <OrderSummary ingredients={this.state.ingredients} />
        </Modal>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls ingredientAdded={this.addIngredientHandler}
        ingredientRemoved={this.removeIngredientHandler} disabled={disabledInfo}
        purchasable={this.state.purchasable}
        price={this.state.totalPrice}
        />
    </Aux>
)
```

However, when we go to check our app in the console, we get the warning that we need to have a unique key for our list item. That can be fixed in the `orderSummary` **Component**. We just need to add the following:

```jsx
const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(ingKey => {
            return <li key={ingKey}>
                    <span style={{textTransform: 'capitalize'}}>{ingKey}</span>: {props.ingredients[ingKey]}
                </li>
        });
```

Then the warning goes away.

