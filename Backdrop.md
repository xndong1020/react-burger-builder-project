# Re-Using The Backdrop

Now we want to make sure that we have a `Backdrop` **behind** the `SideDrawer` **and that we can open and close it dynamically**.

`SideDrawer.js`:

```jsx
import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux';

const sideDrawer = (props) => {
    return (
        <Aux>
        <Backdrop />
        <div className={classes.SideDrawer}>
            <div className={classes.Logo}>
                <Logo />
            </div>
            <nav>
                <NavigationItems />
            </nav>
        </div>
    </Aux>
    );
};

export default sideDrawer;
```

But when we check out the app in our browser, **we don't see** the `Backdrop`. That's because `Backdrop` has a `show` **property** that **needs to be true** in order to **display** it.

So,

```jsx
// SideDrawer.js

const sideDrawer = (props) => {
    return (
        <Aux>
        <Backdrop show/>
        <div className={classes.SideDrawer}>
            <div className={classes.Logo}>
                <Logo />
            </div>
            <nav>
                <NavigationItems />
            </nav>
        </div>
    </Aux>
    );
};
```

We can simply **add** `show` **property** ***just like that*** because it is a `boolean`. **If it is true, it will display. If it is not, it will not**. But now we have to be able to toggle it. -> We need to **register** a `click listener` on the `Backdrop`. -> Already have one.

We have the **click listener** `clicked` in `Backdrop.js`, and it **can click** **anything** we want to **fire**.

The goal is to be able to **handle this method** in the `SideDrawer`. In the `Modal`, we propagated the click up, up to our holding container via `props.modalClosed`.

Since the `Layout Component` **hosts** both `Toolbar` and `SideDrawer`, and **making** `SideDrawer` a `stateful` **Component** would mean **unwanted** `side effects` in `Toolbar`, the Backdrop would be triggered in the Toolbar as well, it's **better** and much **more efficient** to **transform** `Layout` **Component** into a `class`**Component**. We need a **connection between** `Toolbar` and `SideDrawer`, and we **already have that connection** in the `Layout` **Component**. This would NOT **result** in **unwanted side effects**.

Our **goal** is to **listen to the SideDrawer closing itself** by **clicking** on the `Backdrop`, and the **Toolbar opening the SideDrawe**r by **clicking** on the `toggle button`.

```jsx
// Layout.js

import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import layoutClasses from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    render() {
        return (
            <Aux>
                <Toolbar />
                <SideDrawer />
                <main className={layoutClasses.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout;
```

Now `props` can be accessed with `this`. -> **Add a new method** called `sideDrawerClosedHandler`.

```jsx
// Layout.js

import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import layoutClasses from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: true // for testing
    }
    sideDrawerClosedHandler = () => {
        this.setState({
            showSideDrawer: false
        })
    }
    render() {
        return (
            <Aux>
                <Toolbar />
                <SideDrawer closed={this.sideDrawerClosedHandler} />
                <main className={layoutClasses.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout;
```

Next we need to pass the new `sideDrawerClosedHandler` to our `SideDrawer` in `Layout.js`.

```jsx
// Layout.js

return (
    <Aux>
        <Toolbar />
        <SideDrawer closed={this.sideDrawerClosedHandler} /> <-
        <main className={layoutClasses.Content}>
            {this.props.children}
        </main>
    </Aux>
)
```

Now **we have to use** the `closed` **property** in `SideDrawer.js`. There we'll use it to pass it on to the `Backdrop` where we **already** **have** a `clicked` **property**, which will pass on the `onClick` event basically.

```jsx
// SideDrawer.js

const sideDrawer = (props) => {
    return (
        <Aux>
        <Backdrop show clicked={props.closed}/> <-
        <div className={classes.SideDrawer}>
            <div className={classes.Logo}>
                <Logo />
            </div>
            <nav>
                <NavigationItems />
            </nav>
        </div>
    </Aux>
    );
};
```

Since we have made these **changes**, `show` should also be **bound dynamically**.

```jsx
// SideDrawer.js

onst sideDrawer = (props) => {
    return (
        <Aux>
        <Backdrop show={props.open} clicked={props.closed}/> <-
        <div className={classes.SideDrawer}>
            <div className={classes.Logo}>
                <Logo />
            </div>
            <nav>
                <NavigationItems />
            </nav>
        </div>
    </Aux>
    );
};
```

Next the `open` **prop** needs to be **set on** the `SideDrawer`. -> Layout.js.

```jsx
// Layout.js

class Layout extends Component {
    state = {
        showSideDrawer: true // for testing
    }
    sideDrawerClosedHandler = () => {
        this.setState({
            showSideDrawer: false
        })
    }
    render() {
        return (
            <Aux>
                <Toolbar />
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} /> <-
                <main className={layoutClasses.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}
```

Now, when you **click on** a `NavigationItem` in `< 500px`, the `Backdrop` **appears**. And when you **click on** the `Backdrop`, it **disappears**. We still have to make it that when we **click** on the `Backdrop` that the `SideDrawer` also **disappears**.

In `SideDrawer.css`, we have an `.Open` and `.Close` class. We have to attach these classes conditionally, because they will move the `SideDrawer` **out** of the page **or into** it, and they will **play an animation with it** due to the `transition` **property** in `.SideDrawer` class. We need to conditionally attach the `.Open` or `.Close` class . We need to do that **before** we return `JSX` in the `SideDrawer.js`.

-> New `const attachedClasses` which **should always contain**`classes.SideDrawer`, **but the next element in the array by default** could be the `classes.Close`.

The `.Open` class should be added when the `open` **property** is `true`. So`if props.open is true`, the `attachedClasses` should have the `.Open` class and not the `.Close` class. In that case, `const -> let`. That also means that **in the div** right **below** ``, **instead of** having `className={classes.SideDrawer}`, we have `attachedClasses`. And since **we can't pass an array of strings** but a **single string**, we **attach** `.join(' ')` to `attachedClasses`.

```jsx
// SideDrawer.js

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if(props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Aux>
        <Backdrop show={props.open} clicked={props.closed}/>
        <div className={attachedClasses.join(' ')}>
            <div className={classes.Logo}>
                <Logo />
            </div>
            <nav>
                <NavigationItems />
            </nav>
        </div>
    </Aux>
    );
};
```

Now when we click on ``, we have a `SideDrawer` which **does disappear**. Next we have to **create the toggle button** (MENU) to also **move it IN** when we **click the toggle button**.

