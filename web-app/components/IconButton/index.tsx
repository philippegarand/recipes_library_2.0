import React from 'react';

import { Icon } from '..';
import { IconButton, IconButtonProps } from '@material-ui/core';
import { iconsList } from '../Icon';

interface IProps extends IconButtonProps {
  icon: keyof typeof iconsList;
  fontSize?: 'inherit' | 'default' | 'small' | 'large';
}

export default function CustomIconButton(props: IProps) {
  const {
    icon,
    color = 'inherit',
    fontSize = 'default',
    ...otherProps
  } = props;

  return (
    <IconButton
      {...otherProps}
      style={{ color: '#fff', ...props.style }}
    >
      <Icon icon={icon} fontSize={fontSize} color={color} />
    </IconButton>
  );
}
