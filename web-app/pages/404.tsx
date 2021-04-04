import React from 'react';
import { Typography } from '@material-ui/core';
import styles from '../styles/NotFound.module.css';
import { ROUTES } from '../Utils/enums';
import { Button } from '../components';
import Link from 'next/link';
import Head from 'next/head';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>

      <div className={styles.parentDiv}>
        <Typography variant="h1">404</Typography>
        <Typography variant="h4">Oups!</Typography>
        <Typography variant="h5">Page non trouvée...</Typography>
        <Link href={ROUTES.LIBRARY}>
          <Button
            className={styles.goHomeButton}
            size="large"
            variant="contained"
            color="primary"
          >
            Revenir à la bibliothèque
          </Button>
        </Link>
      </div>
    </>
  );
}
