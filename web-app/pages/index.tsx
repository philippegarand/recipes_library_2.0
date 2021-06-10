import React from 'react';
import { ROUTES } from '../Utils/enums';
import { Typography } from '@material-ui/core';
import { Button } from '../components';
import Image from 'next/image';
import Head from 'next/head';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';

import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home() {
  const isSmall = useMediaQuery(1280);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Menu</title>
      </Head>

      <div className={styles.mainDiv}>
        <div className={styles.splash}>
          <Image
            src="/images/cover.jpg"
            alt="home splash"
            width={600} //1.5
            height={400}
          />
        </div>
        <Typography variant="h3" align="center">
          Bibliothèque de recettes
        </Typography>
        <div className={styles.logo}>
          <Image
            src="/images/e5_logo.png"
            alt="logo"
            width={187.5} // 3.75
            height={50}
          />
        </div>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={() => router.push(ROUTES.LIBRARY)}
        >
          Voir les recettes
        </Button>
        {!isSmall && (
          <div>
            <Typography className={styles.or} variant="body2" align="center">
              — ou —
            </Typography>
            <Button
              size="medium"
              variant="outlined"
              color="primary"
              onClick={() => router.push(ROUTES.IMPORT_RECIPE)}
            >
              Importer une recette
            </Button>
          </div>
        )}
        <div className={styles.madeBy}>
          <Typography variant="caption">Fait par Philippe Garand</Typography>
        </div>
      </div>
    </>
  );
}
