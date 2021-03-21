import React from 'react';
import { Card, TextField, Typography } from '@material-ui/core';
import Icon from '../../Icon';

import styles from '../ListReorder.module.css';
import { DraggableProps } from 'react-draggable';

interface IProps {
  index: number;
  text: string;
  refProp: any;
  draggableProps: DraggableProps;
  dragHandleProps: any;
  onRemove: Function;
  onChange: (newVal: string) => void;
  error: boolean;
  helperText: string;
}

export default function ListCard(props: IProps) {
  const {
    index,
    text,
    refProp,
    draggableProps,
    dragHandleProps,
    onRemove,
    onChange,
    error,
    helperText,
  } = props;

  const handleRemoveCard = () => {
    onRemove();
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChange(event.currentTarget.value);
  };

  return (
    <Card
      className={styles.card}
      ref={refProp}
      {...draggableProps}
      {...dragHandleProps}
    >
      <div className={styles.cardHeader}>
        <Typography className={styles.cardIndex} variant="body2">
          {index}
        </Typography>
        <Icon
          className={styles.cardRemove}
          icon="RemoveIcon"
          color="secondary"
          onClick={handleRemoveCard}
        />
      </div>
      <TextField
        fullWidth
        multiline
        value={text}
        onChange={handleTextChange}
        InputProps={{
          style: { fontSize: 16 },
          spellCheck: true,
          lang: 'fr',
        }}
        error={error}
        helperText={helperText}
      />
    </Card>
  );
}
