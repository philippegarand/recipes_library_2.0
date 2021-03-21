import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import React from 'react';
import { FOR_HOW_MANY_ENUM } from '../../../Utils/enums';

interface IProps {
  value: FOR_HOW_MANY_ENUM;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: any;
}

export default function EditForHowMany(props: IProps) {
  const { value, handleChange, style } = props;
  return (
    <FormControl component="fieldset" style={style}>
      <RadioGroup
        name="forHowMany"
        value={value}
        onChange={handleChange}
        row
      >
        <FormControlLabel
          value={FOR_HOW_MANY_ENUM.TWO_THREE}
          control={<Radio color="primary" />}
          label={FOR_HOW_MANY_ENUM.TWO_THREE}
        />
        <FormControlLabel
          value={FOR_HOW_MANY_ENUM.FOUR_FIVE}
          control={<Radio color="primary" />}
          label={FOR_HOW_MANY_ENUM.FOUR_FIVE}
        />
      </RadioGroup>
    </FormControl>
  );
}
