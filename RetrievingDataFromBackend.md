# Retrieving Data From The Backend

Now we can post our orders to the backend. But we also want to get some data from the backend. Why don't we get our ingredients from there?

First we add a new node in FB called ingredients. There we add the ingredients we have in state and set the values to 0.

Then we copy the url associated with that node.'

Next, we want to **set up the state** **dynamically**. Good place for **fetching data** -> `componentDidMount()`. We also should set our `ingredients to null` **initially** now.

```jsx
// BurgerBuilder.js

componentDidMount() {
    axios.get('https://burger-builder-1b02b.firebaseio.com/ingredients.json')
    .then(response => {
        this.setState({
            ingredients: response.data
        })
    })
}
```

-> now we get an error.

```
OrderSummary.js:6 Uncaught TypeError: Cannot convert undefined or null to object
```

This is because **parts of the UI** which **depend on the data** will **fail**. -> This **can be prevented** by `checking` if we have `ingredients` before `rendering anything` which `depends` on `ingredients`. i.e., burger.

There are a couple of ways we could handle this, but we will handle it in our Container -> Burger. We want to show a spinner instead of a Burger, and instead of the BuildControls, while we are waiting for the ingredients to load.

To do that, we will **add another variable** above the **return statement**, which we'll call `burger`. it will **store** `Burger` and `BuildControls`, but should only **return** them **if** there are any **ingredients**. So we'll make it the overwrite. We'll set the `let burger` **variable** **prior** to that.

```jsx
// BurgerBuilder.js

let burger = <Spinner />
if(this.state.ingredients) {
    burger = (
        <Aux>
            <Burger
            ingredients={this.state.ingredients}
            />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler} disabled={disabledInfo}
                purchasable={this.state.purchasable}
                price={this.state.totalPrice}
                ordered={this.purchaseHandler}
            />
        </Aux>
    );
}
return (
    <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
        </Modal>

    </Aux>
)
```

So `burger` is `Spinner` **unless** `ingredients` are **not null**. -> output `burger` below the `Modal`.

```jsx
// BurgerBuilder.js

return (
    <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
        </Modal>
        {burger}
    </Aux>
)
```

But we still have **another issue**. The `OrderSummary` also **depends on** the `ingredients`.

```
let orderSummary = null;
let burger = <Spinner />
```

We will also **overwrite** the `orderSummary` **variable** with the **same check** we use for the `burger`.

```jsx
let orderSummary = null;
let burger = <Spinner />
if(this.state.ingredients) {
    burger = (
        <Aux>
            <Burger
                ingredients={this.state.ingredients}
            />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler} disabled={disabledInfo}
                purchasable={this.state.purchasable}
                price={this.state.totalPrice}
                ordered={this.purchaseHandler}
            />
        </Aux>
    );
    orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
    />
}
```

We also want to make sure that we **overwrite the above** again if loading is set.

```jsx
if(this.state.loading) {
    orderSummary = <Spinner />;
}
return (
    <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
        </Modal>
        {burger}
    </Aux>
)
```

This is so that we can **overwrite** `OrderSummary` when needed.

Now when we go to the browser window, we **see** the `Spinner` **for a second**, and then can continue with the app. And everything still works as before.

Now we both have a POST and GET request.

However, if we were to **remove** the `.json` **from the** `GET` **url**, and we go back to the browser window and console, we see that we are **not getting** our `error Modal`. Only the Spinner. Why is that?

componentDidMount() in withDErrorHandler worked great for the POST request, but not for the GET request.

componentDidMount() is called AFTER all child Components have been rendered. This means after componentDidMount() was completed in the child Components.

In our `withErrorHandler`, we are **wrapping** our `WrappedComponent`, which is our `BB Container`. That has **one implication**. -> `componentDidMount()` in the `withErrorHandler` **will only be called once** `componentDidMount()` was **called** in `WrappedComponent`. And since we **reach out to the web** in `componentDidMount()` of the `WrappedComponent`, we **never set up** our `interceptors`.

Using `componentWillMount()` **instead** in both **withErrorHandler.js** means that it will be **called before** the `child Components` are **rendered**. We're also not causing side effects here. We're just **registering** the `interceptors` in `componentWillMount()`. And **we want to do that before** the `child Components` are **rendered**.

However, now when we go back to the browser and reload the page, we see the error Modal for a second, but then we get the following errors in the console:

```
Failed to load https://console.firebase.google.com/project/burger-builder-1b02b/database/data/ingredients: Redirect from 'https://console.firebase.google.com/project/burger-builder-1b02b/database/data/ingredients' to 'https://accounts.google.com/ServiceLogin?passive=1209600&osid=1&continue=https://console.firebase.google.com/project/burger-builder-1b02b/database/data/ingredients&followup=https://console.firebase.google.com/project/burger-builder-1b02b/database/data/ingredients' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
Modal.js:11 [Modal] WillUpdate
BurgerBuilder.js:29 Uncaught (in promise) TypeError: Cannot read property 'data' of undefined
```

This is because we **failed** to **set our stat**e. That's because the `.then()` **block** gets **executed** in our **BB** **even though** we have an **error**. -> the reason for that is that we don't have a `.catch()` method there in the `componentDidMount` of the **BB**.

We could handle this specific error for the specific BB page by by setting UI/state. We could set an error state. -> `error: false` initially.

```jsx
// BurgerBuilder.js

state = {
    ingredients: null,
    totalPrice: 4.5,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false <-
}
```

Then in componentDidMount(),

```jsx
// BurgerBuilder.js

componentDidMount() {
    axios.get('https://burger-builder-1b02b.firebaseio.com/ingredients')
    .then(response => {
        this.setState({
            ingredients: response.data
        })
    })
    .catch(error => {
        this.setState({
            error: true <-
        })
    })
}
```

Then in `render()`,

```jsx
// BurgerBuilder.js

let orderSummary = null;
let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
```

When we first go to the browser, we see that we **get** the the `Spinner`, then the `Network Error` **message**, and when we `click` on the `Backdrop` to **remove** it, we see the `Ingredients can't be loaded!` message. Our app IS broken, but at least we show it to the user.

Once we **fix** the GET request link by adding `.json` again, the **error message** goes away.