# Calculating The Ingredient Sum Dynamically

What happens now if we actually have a **burger which starts with all ingredients set to 0**? We are left with the bread on top and on bottom. There is no error or anything because we just have an **empty array which we try to render**, but it would be **better if we had a message like** "please add some ingredients" or something like that.

**In order to be able to output a message if there are no inredients present, we have to check whether there ARE any ingredients or not.** `transformedIngredients` is always going to be an **array**. Just an **array of empty arrays**. That is something that is kind of HARD to **check**. So how can we then find out if we have ingredients or not?

We can `.reduce()` the `transformedIngredients` **array**. But first we can console.log it to see what it looks like:

```
[Array(0), Array(0), Array(0), Array(0)]
```

Checking the length would not do anything, because the length is 4. It is the **inner arrays** which are **interesting** to us. So **what we can do is flatten the array** with `.reduce()` to **make sure we pull out all the values of the inner arrays** and **create one array** which **contains all the values**. we can add .reduce() to the end of the value of transformedIngredients:

```jsx
const transformedIngredients = Object.keys(props.ingredients)
  .map(ingKey => {
    return [...Array(props.ingredients[ingKey])].map((_, i) => {
      return <BurgerIngredient key={ingKey + i} type={ingKey} />;
    });
  })
  .reduce();
```

`.reduce(`): applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.

Syntax:

```js
arr.reduce(callback[, initialValue])
```

**Parameters:**

```js
callback;
```

Function to execute on each element in the array, taking four arguments:

```js
accumulator;
```

The accumulator **accumulates** the callback's return values; it is the accumulated value previously returned in the last invocation of the callback, or

```js
initialValue;
```

, if supplied (see below).

```js
currentValue;
```

The **current element** being processed in the array.

```js
currentIndex;
```

The **index of the current element** being processed in the array. Starts at index 0, if an

```js
initialValue;
```

is provided, and at index 1 otherwise.

```js
array;
```

**The array**

```js
reduce();
```

was called upon.

**Return value**

The value that results from the reduction.

But `.reduce()` doesn't stop there. We have to do the following to it in 1Burger.js1:

```jsx
const transformedIngredients = Object.keys(props.ingredients)
  .map(ingKey => {
    return [...Array(props.ingredients[ingKey])].map((_, i) => {
      return <BurgerIngredient key={ingKey + i} type={ingKey} />;
    });
  })
  .reduce((arr, el) => {
    return arr.concat(el);
  }, []);
```

`.reduce()` takes the `transformedIngredients` `arr` as its `first arg`, which is the `currentValue` (the `initial value` is the [] array where the concatenated elements reduced to one end up), and `el` is the individual element in the array which is returned and concatenated to the previous element passed in to the callback function. It can be regarded as the `currentIndex`.

**Array.prototype.concat()**

```js
Array.concat();
```

The **concat()** method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.

So now we have an `array` which is **either empty** or **contains** the `JSX elements`. Since it MIGHT be empty, we can simply check if transformedIngredients.length is equal to 0. Then if that is the case, then we want to output a paragraph where we say "Please start adding elements". We will therefore convert const to let for transformedIngredients since the value of transformedIngredients will change.

```jsx
const burger = props => {
  let transformedIngredients = Object.keys(props.ingredients)
    .map(ingKey => {
      return [...Array(props.ingredients[ingKey])].map((_, i) => {
        return <BurgerIngredient key={ingKey + i} type={ingKey} />;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);
  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>;
  }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};
```

Now you will see the message sandwiched between the bread.

### Adding The Order Button

https://interglobalmedia.gitbooks.io/react-notes/adding-the-order-button.html
