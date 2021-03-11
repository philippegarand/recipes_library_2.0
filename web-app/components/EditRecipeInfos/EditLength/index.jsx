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

/**
 *
 * @param value displayed value
 * @param handleChange function to handle change
 * @param style inline style
 * @param size buttons size
 * @returns
 */
export default function EditLength(props) {
  const { value, handleChange, style, size = 'medium' } = props;

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      style={style}
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
