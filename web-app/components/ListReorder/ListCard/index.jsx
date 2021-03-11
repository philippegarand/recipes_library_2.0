import React from 'react';
import { Card, TextField, Typography } from '@material-ui/core';
import Icon from '../../Icon';

import styles from '../ListReorder.module.css';

export default function ListCard(props) {
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

  const handleTextChange = (e) => {
    onChange(e.target.value);
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
        }}
        error={error}
        helperText={helperText}
      />
    </Card>
  );
}
