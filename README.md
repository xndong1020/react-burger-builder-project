## Planning The Burger React App

1. **Component Tree / Component Structure**
2. **Application State (Data)**
3. **Components vs Containers** 
   - Plan for Stateful vs Presentational Components
   - Container file will normally connect to redux later



#### 								<u>Burger Builder</u>

Use this Burger Builder to build your own burger with different ingredients.

![image-20200428134317565](/Users/nicoledong/Library/Application Support/typora-user-images/image-20200428134317565.png)

####                                    Root Layout

![image-20200428141108563](/Users/nicoledong/Library/Application Support/typora-user-images/image-20200428141108563.png)

- **App** component, a base layout for this app which basically would be the header and the body.

- **Layout** component, has a couple of other components nested besides it, some component respontive for *navigation* and for the *content*, so the navigation on the other hand might be split up in a **tool bar** and a **sideDrawer**. so we have cater for both mobile devices and desktop devices.
  - **Toolbar**, displayed and the items we display on it varies by the viewport.
  - **sideDrawer**, simply the side menu we can bring in when we're on the mobile.
  - **Backdrop**, in case we want to show a modal for the checkout. Also a backdrop on the root level of out DOM.
  - **{props.children}**  Something we can dynamically wrap, whichever page you want to display. later in the app, we're going to add Routing, to navigate to different pages. So we might want to display the burger builder page or the checkout page but all pages are going to share that layout. So {props.children} is essential here to allow us to dynamically pass a component in too depending on which page we want to do. This {props.children} just as a dynamic component which we nest into out layout.															![Screen Shot 2020-04-28 at 2.16.07 pm](/Users/nicoledong/Desktop/Screen Shot 2020-04-28 at 2.16.07 pm.png)



#### Planning the State

This state is important because it allows us to identify what should be a component and what should be a container. What should be a stateless component and what should be a stateful component.

**<u>State:</u>**

- Ingredients
  - Eg. {meat:1, cheese:2}
- Purchased: true
- totalPrice: $18

So the *burger builder* should be a **stateful** component, it should be a **container**. All other components can be dumb components (stateless components).

![Screen Shot 2020-04-28 at 4.57.13 pm](/Users/nicoledong/Desktop/Screen Shot 2020-04-28 at 4.57.13 pm.png)

## Setting up the Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##### Fonts

Using Google fonts - Open Sans (Regular 400 & Bold 700)

Create two folders:

- Components:
  1. Layout folder:
     - Layout.jsx
  2. Burger folder:
     1. BurgerIngredient folder:
        1. BurgerIngredient.jsx
- Containers:
  - BurgerBuilder folder:
    - BurgerBuilder.jsx

Then create a high order components folder:

- hoc folder:
  - Aux.jsx





