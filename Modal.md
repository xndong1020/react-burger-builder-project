# Showing and Hiding The Modal

First we'll **add the logic** for **showing** and **hiding** the `Modal` in `BurgerBuilder`.

We can **add** `purchasing: false` below `purchasable: false` for starters. `purchasing` will **turn false** when we **click** on the **Order Now button**.

Then we can **add a new Handler method** called `PurchaseHandler` in `BurgerBuilder`. It's a **normal method**. It should be **triggered** whenever we **click** the **Order Now button**.

```jsx
// BurgrBuilder.js

purchaseHandler() {
    this.setState({
        purchasing: true
    })
}
```

Then we need to pass this method to ``. -> go into `BuildControls.js` where the **Order Now button** resides. We need to **add** an `onClick` listener to the **Order Now button**.

```jsx
//BuildControls.js

<button disabled={!props.purchasable} className={classes.OrderButton}
    onClick={props.ordered}>ORDER NOW</button>
```

We can call our `onClick props` whatever we want.`ordered` makes sense. -> Back to the `BurgerBuilde.js`. This is where we have to `pass the props` to `build the controls`.

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
        ordered={this.purchaseHandler}
        />
    </Aux>
)
```

Now we have to **change the visibility** of the `Modal`. We already have animation added to the .Modal class in Modal.css. we should take advantage of that in `` in `BurgerBuilder.js` along with **showing and hiding** the `Modal` there. In order for our animation to work however, we can't add or remove Modal from the DOM. We have to achieve this with some CSS. We can do this by passing a property to Modal called show and **bind** it to the `purchasing state`.

```jsx
// BurgerBuilder.js

<Modal show={this.state.purchasing}>
    <OrderSummary ingredients={this.state.ingredients} />
</Modal>
```

-> `Modal.js`.

```jsx
// Modal.js

const modal = (props) => (
    <div className={classes.Modal}
        style={{
            transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.show ? '1' : '0'
        }}>
        {props.children}
    </div>
);
```

So now by default the `Modal` is NOT visible. However, if we **try and add some ingredients** and **then click on the Order Now button**, we get an **error**.

```
BurgerBuilder.js:80 Uncaught TypeError: Cannot read property 'setState' of undefined
    at purchaseHandler (BurgerBuilder.js:80)
```

That is because of the purchaseHandler() syntax. The syntax we implemented will not maintain the context of `this`. So we change the syntax of the purchaseHandler method to

```jsx
purchaseHandler = () => {
    this.setState({
        purchasing: true
    })
}
```

and then everything works as expected, including the animation.

