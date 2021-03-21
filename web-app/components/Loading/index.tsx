import { CircularProgress } from '@material-ui/core';
import styles from './Loading.module.css';

export default function Loading() {
  return <CircularProgress className={styles.middle} />;
}
