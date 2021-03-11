import React from 'react';
import { CircularProgress } from '@material-ui/core';
import styles from './Loading.module.css';

export default function Loading(props) {
  return <CircularProgress className={styles.middle} />;
}
