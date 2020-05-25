# Handling Errors

we will set up a **global error handler** which **shows** a `Modal` with the **error message**, but **doesn't use** our current `OrderSummary Modal`. That's because we **don't want to be stuck to** the **BB container**. We want to have a **flexible way** of **showing an error** no matter which in **Component** or **Container** it occurs.

We're going to **add** this `error Modal` to a **higher level** in the app. We will use a **Component higher up** than the **BB container**. We'll **catch errors there** and **make sure** that our **error Modal is displayed**.

-> Create a new `HOC` directory called `withErrorHandler`. We're going to use it **on export** to **wrap** `BB` on **export**.

```jsx
// withErrorHandler.js

import React from 'react';

const withErrorHandler = (WrappedComponent) => {
    return (props) => {
        return (
            <WrappedComponent {...props} />
        );
    }
}

export default withErrorHandler;
```

`withErrorHandler` takes the `WrappedComponent` as an `input`, and then it `returns` a function which `receives props`, which then `returns` some `JSX`. In here, we want to return the WrappedComponent and distribute any props it may have with the spread operator. We don't know which props they are, but we don't want to lose them.

Now we want to **add** our `error Modal`. And `Aux` as well.

```jsx
import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent) => {
    return (props) => {
        return (
            <Aux>
                <Modal>
                    Something didn't work!
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );
    }
}

export default withErrorHandler;
```

-> Now let's use this on the BB.

```jsx
// BurgerBuilder.js

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

export default withErrorHandler(BurgerBuilder);
```

Then, if we go back into withErrorHandler, and add the show property to Modal,

```jsx
// withErrorHandler.js

return (
    <Aux>
        <Modal show>
            Something didn't work!
        </Modal>
        <WrappedComponent {...props} />
    </Aux>
);
```

Now, if we go to the browser window, we'll see that `Something didn't work!` is permanently displayed.

BUT we only want to show this if we have an **error**. So we need to set `show` to something else. That something else needs to come from the WrappedComponent. We need that info if there was a failure. -> To get that information, we should a second arg to the withErrorHandler. -> axios (instance).

```jsx
import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    return (props) => {
        return (
            <Aux>
                <Modal show>
                    Something didn't work!
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );
    }
}

export default withErrorHandler;
```

We **add** `axios` so we can **set up** a **global error handler** on it. To use the `axios instance,` we will **change** the `props functional Component` into a `class based` one. It is an `anonymous class` because we **never use it**. It is **simply returned**. It's essentially a `class factory`. `withErrorHandler` **creates** this `class`.

Inside the `anonymous class`, we need a `render()` method where we **return what we returned** in our `functional Component`.

```jsx
const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        render() {
            return (
                <Aux>
                    <Modal show>
                        Something didn't work!
                    </Modal>
                    <WrappedComponent {...this.props} /> <-
                </Aux>
            );
        }
    }
}
```

Since we are `returning a class` now, we can **add** `componentDidMount()`. -> In `componentDidMount()`, we can **set up** our `axios listener`. On the axios instance, we can set up our global interceptors, which also allows to handle errors.

```jsx
componentDidMount() {
    axios.interceptors.response.use(null, error => {

    });
}
```

With `.use()` we'll **add a function** when to use. -> this **function** `gets the response` (as first arg) and does something with it, **but** we are **not really interested** in that `arg`. -> pass `null`. The **second arg** is the one **we are interested** in. That's the `error case` **when we get an error**. For that, we DON'T **want to show** our `error Modal`.

-> **Add** `state` to **anonymous class**. Initially, error is set to null. And then in the axios instance, we set it to the error we get from Firebase. This error is an object which also contains an error message on the message prop. We can sonsole.log that error to see what is going on there.

```jsx
const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }
        componentDidMount() {
            axios.interceptors.response.use(null, error => {
                this.setState({
                    error: error
                });
            });
        }
        render() {
            return (
                <Aux>
                    <Modal show>
                        Something didn't work!
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}
```

Now we'll add a second axios instance.

```jsx
axios.interceptors.request.use(req => {
    this.setState({
        error: null
    });
});
```

We're **not** really **interested in the request**, but **there is one thing we want to do** in there. We **want to** `call this.setState({})` and `clear` **any errors** so that **whenever we send the request**, we **don't have our error set up** anymore.

-> On the `Modal`, we will `only show` the `error` if `this.state.error` is `not null`.

```jsx
// widthErrorHandler.js

<Modal show={this.state.error}>
    {this.state.error.message}
</Modal>
```

One more thing we have to do. The Modal Component we created also exposes the clicked property which occurs when we click the Backdrop. In this case, we also want to clear the error, because when we click the Modal, we don't want to show it anymore. We have to get rid of the error.

-> **add** `clicked` **property** to `Modal` in `withErrorHandler.js`. -> **create new handler** for this.

```jsx
errorConfirmedHandler = () => {
    this.setState({
        error: null
    })
}
```

And then **add** the `clicked` **property** to `Modal`.

```jsx
<Modal
    show={this.state.error}
    clicked={this.errorConfirmedHandler}
    >
    {this.state.error.message}
</Modal>
```

When we go to the console now, we will see that there is an error. That's because `{this.state.error.message}` will initially throw an error. That's because the `Modal` **Component** is ALWAYS **present**, even though we might not show it.

-> **add** a `ternary expression` to `error Modal`.

```jsx
<Modal
    show={this.state.error}
    clicked={this.errorConfirmedHandler}
    >
    {this.state.error ? this.state.error.message : null}
</Modal>
```

Now, when we go back to the console, we get a different error.

```jsx
withErrorHandler.js:11 Uncaught TypeError: Cannot read property 'interceptors' of undefined
```

This, however, makes sense. So why is this happening? We are **trying to run this on axios**, but **we don't receive axios**. We EXPECT **to get it as an arg**, but in the **BB** where we use `withErrorHandler`, we are **only wrapping** `BB`, and **not** `axios`. So we **have to include** `axios`, which we are **importing** in **BB**, and **which is** our `axios instance`.

```jsx
// BurgerBuilder.js

export default withErrorHandler(BurgerBuilder, axios);
```

Now our **interceptors** `error` **clears**. But we still have to do one more thing. **In** our `interceptors`, we have to `return`something.

```jsx
componentDidMount() {
    axios.interceptors.request.use(req => {
        this.setState({
            error: null
        })
        return req;
    });
    axios.interceptors.response.use(res => res, error => {
        this.setState({
            error: error
        })
    })
```

Now everything still works because there is no error present. But if we add an error... Like **removing** `.json` from the `post method url`, when we **click** on the **Order Now** button, we get the `error Modal` with the **message** `Network Error`.

However, closing on the Backdrop does not get rid of the error Modal.

```jsx
// withErrorHandler.js

<Modal
    show={this.state.error}
    clicked={this.errorConfirmedHandler}
    >
    {this.state.error ? this.state.error.message : null}
</Modal>
// Modal.js

render() {
    return (
    <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
        <div className={classes.Modal}
        style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0'
        }}>
        {this.props.children}
        </div>
    </Aux>
    )
}
```

We are using the `clicked` **property** which is **associated with** the `Modal`, but we **should be using** the `modalClosed` **property**, which is the one **associated** with the `Backdrop`.

```jsx
// withErrorHandler.js

render() {
    return (
        <Aux>
            <Modal
                show={this.state.error}
                modalClosed={this.errorConfirmedHandler}
                >
                {this.state.error ? this.state.error.message : null}
            </Modal>
            <WrappedComponent {...this.props} />
        </Aux>
    );
}
```

Now it works! **We get the error, but we can dismiss it**.

So now we are **handling both** `successes` and `fails`. We **also have** a `HO` **reusable** **Component** which we can **wrap** around any `Component` which uses `axios` to **handle** its **errors**.

