import { withStyles } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React from 'react';
import { RECIPE_LENGHT_ENUM } from '../../../Utils/enums';

const StyledToggleButton = withStyles({
  root: {
    '&$selected': {
      backgroundColor: '#3CC47C',
      color: 'white',
      '&:hover': {
        backgroundColor: '#3CC47C',
      },
    },
  },
  selected: {},
})(ToggleButton);

interface IProps {
  value: RECIPE_LENGHT_ENUM;
  handleChange: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: any,
  ) => void;
  className?: any;
  size?: 'small' | 'medium' | 'large';
}

export default function EditLength(props: IProps) {
  const { value, handleChange, className, size = 'medium' } = props;

  return (
    <ToggleButtonGroup
      className={className}
      value={value}
      exclusive
      onChange={handleChange}
      size={size}
    >
      <StyledToggleButton
        value={RECIPE_LENGHT_ENUM.SHORT}
        aria-label="rapide"
      >
        Rapide
      </StyledToggleButton>
      <StyledToggleButton
        value={RECIPE_LENGHT_ENUM.AVERAGE}
        aria-label="moyenne"
      >
        Moyenne
      </StyledToggleButton>
      <StyledToggleButton
        value={RECIPE_LENGHT_ENUM.LONG}
        aria-label="longue"
      >
        Longue
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
}
