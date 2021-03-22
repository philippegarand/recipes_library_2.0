import React from 'react';
import { Card, Typography, Chip, Divider } from '@material-ui/core';
import { Icon } from '..';
import Rating from '@material-ui/lab/Rating';
import styles from './RecipeCard.module.css';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { RECIPE_TYPE_ENUM, ROUTES } from '../../Utils/enums';
import { IRecipeThumnail } from '../../Utils/types';
import { useRouter } from 'next/router';

const clockColorMap = new Map([
  ['Court', '#00BFFF'],
  ['Moyen', 'orange'],
  ['Long', 'red'],
]);

interface IProps {
  recipe: IRecipeThumnail;
}

export default function RecipeCard(props: IProps) {
  const {
    id,
    title,
    timeToMake,
    rating,
    favorite,
    tags,
    type,
    pictureData,
  } = props.recipe;

  const router = useRouter();

  const vege = tags.some((t) => t.id === 7);
  const spicy = tags.some((t) => t.id === 9);

  return (
    <Card
      className={
        type === RECIPE_TYPE_ENUM.OLD
          ? styles.cardOld
          : styles.cardNew
      }
      onClick={() => router.push(`${ROUTES.RECIPE}/${id}`)}
    >
      <div
        className={
          type === RECIPE_TYPE_ENUM.OLD
            ? styles.divIconImgOld
            : styles.divIconImgNew
        }
      >
        <div className={styles.icons}>
          <Icon
            icon="AlarmIcon"
            customColor={clockColorMap.get(timeToMake)}
          />
          {favorite && (
            <Icon icon="FavoriteIcon" customColor="#ff3d47" />
          )}
          {vege && <Icon icon="EcoIcon" customColor="#3CC47C" />}
          {spicy && (
            <Icon icon="WhatshotIcon" customColor="#FF0000" />
          )}
          <Rating
            className={styles.rating}
            value={rating / 2}
            precision={0.5}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            readOnly
          />
        </div>
        <img
          className={
            type === RECIPE_TYPE_ENUM.OLD
              ? styles.imgOld
              : styles.imgNew
          }
          src={`data:image/jpg;base64,${pictureData}`}
          alt="Recipe Img"
        />
      </div>
      <div className={styles.bottom}>
        <Typography className={styles.title} noWrap variant="body2">
          {title}
        </Typography>
        <Divider className={styles.divider} />
        <div className={styles.tags}>
          {tags.map(
            (tag) =>
              tag.id !== 7 &&
              tag.id !== 9 && (
                <Chip
                  key={tag.id}
                  className={styles.chip}
                  label={tag.text}
                  color="primary"
                />
              ),
          )}
        </div>
      </div>
    </Card>
  );
}
