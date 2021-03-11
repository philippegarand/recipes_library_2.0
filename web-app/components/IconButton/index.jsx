import React from 'react';

import { Icon } from '../';
import { IconButton } from '@material-ui/core';

export default function CustomIconButton(props) {
  const {
    icon = 'Add',
    color = 'inherit',
    onClick = () => {},
    size = 'small',
    fontSize = 'default',
    ...otherProps
  } = props;

  return (
    <IconButton
      size={size}
      onClick={onClick}
      {...otherProps}
      style={{ color: '#fff', ...props.style }}
    >
      <Icon icon={icon} fontSize={fontSize} color={color} />
    </IconButton>
  );
}
