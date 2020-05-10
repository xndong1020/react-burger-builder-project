# Adding The Order Button

Now we'll **create** the `modal` that will **allow us** to **display** our `order summary`.

Let's start out by adding the **Checkout Button**. We'll add it to the `BuildControls`. After we add the ``, we should add some styling for it in `BuildControls.css`.

Next we have to add the disabled property to this button. In order to make this happen, we have to check whether all ingredients have an amount of 0 or if at least one of the ingredients is at 1. Again, the logic for this logic should be managed in the BurgerBuilder Container because that is where we have the state. That is where we know how much of each ingredient we want to add to this burger.

What we need to know is the **total amount of all the ingredients**. The **sum** total. We can adda a new property in state called purchasable, and initially set it to false:

```jsx
// BurgerBuilder.js

state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4.5,
        purchasable: false
    }
```

Then we add a new method to the `BurgerBuilder` called`updatePurchaseState()`. Inside, we want to **check the ingredients** we have in our `state`. Therefore, we will **create a new object** `const ingredients` and **copy** the **ingredient properties** from the `ingredients state` inside it.

```jsx
updatePurchaseState() {
    const ingredients = {
        ...this.state.ingredients
    }
}
```

Next we need to sum up all the values in state. In order to do this, we need to **transform** the **ingredients object** into an **array** again. Into an array of the ingredients values in state. We can create a const sum where we take our JS Object.keys(ingredients) and pass our ingredients to it. But we **need** the **amounts** in the array and **not the names**. So we can map this array into the array we actually need. The function we pass to the `.map()` method still `receives the key` (ingKey), and then we can use it to `return a new value` and `replace the old value`, which was the `property name`, salad, i.e., with the `new value`.

```jsx
updatePurchaseState() {
    const ingredients = {
        ...this.state.ingredients
    }
    const sum = Object.keys(ingredients)
        .map(ingKey => {
            return ingredients[ingKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
    this.setState({
        purchasable: sum > 0
    });
}
```

And we **return** the **value** of a **given ingredient key** from `.map()` from **mapping over** the **array** of **ingredient keys**. After that, we add .reduce() to get the `sum total of ingredients`, `not to flatten the array`. This way we turn it into a `single number`.

Now that we have the purchasable property, we can pass it down to <BuildControls />. We can add a new property there also called purchasable.

```jsx
// BurgerBuilder.js

<BuildControls ingredientAdded={this.addIngredientHandler}
ingredientRemoved={this.removeIngredientHandler} disabled={disabledInfo} price={this.state.totalPrice}
purchasable={this.state.purchasable}/>
```

Then we pass the purchasable property to the ORDER NOW button so as to disable it or not, depending on whether we have at least one ingredient or not.

```jsx
// BuildControls.js

<button disabled={props.purchasable} className={classes.OrderButton}>ORDER NOW</button>
```

At this point, our **Order Now button** is still **enabled** even thought it should **not** be. Somehow `purchasable` is **not passed on correctly**. The problem is `purchasable` IS **true** if the burger IS `purchasable`. So `disabled` has to be **set to true** if the burger is NOT `purchasable`.

```
// BuildControls.js

<button disabled={!props.purchasable} className={classes.OrderButton}>ORDER NOW</button>
```

Now it is **disabled when it should be**, but it also **never becomes active** with this current set up. That's because we never ended up calling the `updatePurchaseState()` method anywhere. We **should call it** ***after*** `addIngredientHandler` or `removeIngredientHandler`.

```jsx
// BurgerBuilder.js

addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState();
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const disabledInfo = {
            ...this.state.indgredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState();
    }
```

This is great that the **Order Now button** is **activated** when the 2nd **ingredient is added.** This is an error that has something to do with the `updatePurchaseState()` method. The problem is that the ingredients that we are analyzing in the updatePurchaseState() method is the **old state**:

```jsx
const ingredients = {
    ...this.state.ingredients
}
```

Due to the way `.setState({})` works when we **execute** `updatePurchaseState()`, we might not get the `updatedIngredients`. Therefore, once we copy the ingredients and analyze them, we might get an outdated version. We can **fix this** by **passing** the `updatedIngredient`s to the `updatePurchaseState(updatedIngredients)` method and **expect to get** `ingredients` there.

```jsx
// BurgerBuilder.js

updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
        .map(ingKey => {
            return ingredients[ingKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
    this.setState({
        purchasable: sum > 0
    });
}
addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
        ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
        totalPrice: newPrice,
        ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
}
removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0) {
        return;
    }
    const disabledInfo = {
        ...this.state.indgredients
    };
    for(let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
        ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
        totalPrice: newPrice,
        ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
}
```

So that means we can use `ingredients` passed to `updatePurchaseState(ingredients)` instead of the `const ingredients copy`. And then it works as expected.

