import React from 'react';

import classes from './Button.module.css';

const Button = props => {
  return (
    <button
      disabled={props.disabled}
      // We always want to assign the .Button class, but conditionally .Success or .Danger. -> classes[props.btnType] to dynamically pull out certain type(s). btnType is a prop we have to set up from outside , and it will have to be either .Danger or .Success. This approach is very flexible and easy to implement.

      // We wrap the classes in className in an [] because in className we need our classes to be strings in the end.
      // Right now our classes are an array of strings. We can change this to one big string by adding .join(' ').
      className={[classes.Button, classes[props.btnType]].join(' ')}
      onClick={props.clicked}
    >
      {props.children}
    </button>
  );
};

export default Button;
