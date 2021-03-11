import React from 'react';
import Button from '@material-ui/core/Button';
import { Icon } from '../';

export default function CustomButton(props) {
  const { color, variant, endIcon, size } = props;

  let textColor =
    variant === 'outlined' || variant === 'text'
      ? 'primary'
      : 'white';

  const btnEndIcon = endIcon ? <Icon icon={endIcon} /> : <></>;

  return (
    <Button
      size={size || 'small'}
      variant={variant}
      color={color}
      {...props}
      style={{ color: textColor, ...props.style }}
      endIcon={btnEndIcon}
    />
  );
}
