import React from 'react';

import classes from './DrawerToggle.module.css';

const DrawerToggle = props => {
  return (
    <div className={classes.DrawerToggle} onClick={props.clicked}>
        {/* Here needs to hold three div elements because of the assigned css styling */}
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default DrawerToggle;
