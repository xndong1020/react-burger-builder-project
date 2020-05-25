# Removing Old Interceptors

We have one little thing we could definitely improve upon. Our `withErrorHandler` method ***can*** be wrapped around **multiple Components**. That's the whole idea. The problem we have is, if we **add** this `HOC` `withErrorHandler` to **other** Components, we'll call `componentWillMount()` **again** and **again**. That's **because** the `class` that we **return** in this `HOC` is **created** `every time` `withErrorHandler` is **wrapped** `around an existing` **Component**.

-> We are **attaching** `multiple interceptors` in our **app**, and we are **attaching them** to the **same** `axios` **instance**. -> all the OLD `interceptors` **still exist**. -> we have a lot of "dead" (not really dead) interceptors sitting in memory, which still react to our requests, and in the worst case scenario, they read to errors or somehow change the state of the app. But even in the best case scenario, they **leak memory**. That's **code that still runs** that is NOT **required anymore**.

-> We should **remove** the `interceptors` when `withErrorHandler` is **unmounted**. -> when an instance is no longer needed. -> There is a **life cycle hook** **for this** too.

-> `componentWillUnmount()`.

`componentWillUnmount()`: **executed** when a **Component** is **no longer required**. To be able to **remove** an `interceptors` here, we need to **store a reference** to the `interceptors` we **create** in **properties** of the **anonymous class**. -> We already have the state property. We can now add new properties.

-> create a new property on the fly by using `this` to refer to the class, and then any name we choose.

```jsx
// withErrorHandler.js

componentWillMount() {
    this.reqInterceptor = axios.interceptors.request.use(req => {
        this.setState({
            error: null
        })
        return req;
    });
    this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        this.setState({
            error: error
        })
    });
}
```

So now we have **two new properties** in our **class**. -> We can **use them** in `unmount` to **remove** the `interceptors`.

```jsx
// withErrorHandler.js

componentWillUnmount() {
    axios.interceptors.request.eject(this.reqInterceptor);
    axios.interceptors.response.eject(this.resInterceptor);
}
```

To quickly see if that works, we can go into the `App.js` file, and we'll add some code to **remove** `<BurgerBuilder />` after a certain period of time just to see if `componentWillUnmount()` works.

```jsx
// withErrorHandler.js

componentWillUnmount() {
    console.log('Will Unmount', this.reqInterceptor, this.resInterceptor);
    axios.interceptors.request.eject(this.reqInterceptor);
    axios.interceptors.response.eject(this.resInterceptor);
}
// App.js

class App extends Component {
    state = {
        show: true
    }
  render() {
    return (
      <div>
          <Layout>
              {this.state.show ? <BurgerBuilder /> : null}
          </Layout>
      </div>
    );
  }
}
```

We have added a temporary state, and a temporary ternary expression around BB.

Now we just need a way to **unset show** after a time. -> `componentDidMount()`.

```jsx
// App.js

componentDidMount() {
    setTimeout(() => {
        this.setState({
            show: false
        })
    }, 5000);
}
```

When we go back to the browser/console, we see

```jsx
[Modal] WillUpdate
withErrorHandler.js:24 Will Unmount 0 0
```

This is correct. The 0s are the ids being kept in memory by `axios` for the `req` and `res` interceptors. So `componentWillUnmount` does work.

