import React from 'react';
import { ROUTES } from '../Utils/enums';
import { Typography } from '@material-ui/core';
import { Button } from '../components';
import Link from '@material-ui/core/Link';
import Image from 'next/image';

import styles from '../styles/Home.module.css';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';

export default function Home() {
  const isSmall = useMediaQuery(1280);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.splash}>
        <Image
          src="/cover.jpg"
          alt="home splash"
          width={600} //1.5
          height={400}
        />
      </div>
      <Typography variant="h3">Bibliothèque de recettes</Typography>
      <Image
        src="/e5_logo.png"
        alt="logo"
        width={187.5} // 3.75
        height={50}
      />
      <Link className={styles.viewRecipesBtn} href={ROUTES.LIBRARY}>
        <Button size="medium" variant="contained" color="primary">
          Voir les recettes
        </Button>
      </Link>
      {isSmall ? null : (
        <div>
          <Typography
            className={styles.or}
            variant="body2"
            align="center"
          >
            — ou —
          </Typography>
          <Link href={ROUTES.IMPORT_RECIPE}>
            <Button size="medium" variant="outlined" color="primary">
              Importer une recette
            </Button>
          </Link>
        </div>
      )}
      <div className={styles.madeBy}>
        <Typography variant="caption">
          Fait par Philippe Garand
        </Typography>
      </div>
    </div>
  );
}
