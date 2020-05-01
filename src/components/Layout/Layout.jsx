import React from 'react';

import Aux from '../../hoc/Aux';
import classes from './Layout.module.scss';
import Toolbar from '../Navigation/Toolbar/Toolbar';

const Layouts = props => (
  <Aux>
    <Toolbar />
    <main className={classes.Content}>{props.children}</main>
  </Aux>
);

export default Layouts;
