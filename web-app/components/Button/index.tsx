import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Icon } from '..';
import { iconsList } from '../Icon';

interface IProps extends ButtonProps {
  endIcon?: keyof typeof iconsList;
}

export default function CustomButton(props: IProps) {
  const { color, variant, endIcon } = props;

  let textColor =
    variant === 'outlined' || variant === 'text'
      ? 'primary'
      : 'white';

  const btnEndIcon = endIcon && <Icon icon={endIcon} />;

  return (
    <Button
      {...props}
      variant={variant}
      color={color}
      style={{ color: textColor, ...props.style }}
      endIcon={btnEndIcon}
    />
  );
}
