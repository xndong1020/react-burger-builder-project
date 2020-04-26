import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import { classExpression } from '@babel/types';

const Burger = props => {
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      <BurgerIngredient type="bread-bottom" />
      <BurgerIngredient type="meat" />
      <BurgerIngredient type="cheese" />
      <BurgerIngredient type="bacon" />
      <BurgerIngredient type="salad" />
    </div>
  );
};

export default Burger;
