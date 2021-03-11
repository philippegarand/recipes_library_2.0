import React, { useEffect, useState } from 'react';
import { Card, Typography, Chip, Divider } from '@material-ui/core';
import { Icon } from '../';
import Rating from '@material-ui/lab/Rating';
import styles from './RecipeCard.module.css';
import StarBorderIcon from '@material-ui/icons/StarBorder';
//import api from '../../helper/api';
//import { formatRoute, goToRecipe } from '../../helper/goTo';
import { RECIPE_TYPE_ENUM } from '../../Utils/enums';

const clockColorMap = new Map([
  ['Court', '#00BFFF'],
  ['Moyen', 'orange'],
  ['Long', 'red'],
]);

export default function RecipeCard(props) {
  const {
    id,
    title,
    timeToMake,
    rating,
    favorite,
    tags,
    type,
  } = props.recipe;
  const vege = tags.some((t) => t.tagId === 7);
  const spicy = tags.some((t) => t.tagId === 9);

  const [imgData, setImgData] = useState('');

  useEffect(() => {
    // const getImage = async () => {
    //   const picture = await api(
    //     formatRoute(`/api/DB/img/${id}`, null),
    //   );
    //   setImgData(picture.data);
    // };
    // getImage();
  }, [id]);

  return (
    <Card
      className={
        type === RECIPE_TYPE_ENUM.OLD
          ? styles.cardOld
          : styles.cardNew
      }
      onClick={() => goToRecipe(id)}
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
          {favorite ? (
            <Icon icon="FavoriteIcon" customColor="#ff3d47" />
          ) : (
            <></>
          )}
          {vege ? (
            <Icon icon="EcoIcon" customColor="#3CC47C" />
          ) : (
            <></>
          )}
          {spicy ? (
            <Icon icon="WhatshotIcon" customColor="#FF0000" />
          ) : (
            <></>
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
          src={`data:image/PNG;base64,${imgData}`}
          alt="Recipe Img"
        />
      </div>
      <div className={styles.bottom}>
        <Typography className={styles.title} noWrap variant="body2">
          {title}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Divider
            className={styles.divider}
            style={{
              width: '90%',
              marginBottom: '8px',
              marginTop: '2px',
            }}
          />
        </div>
        <div className={styles.tags}>
          {tags.map((tag, index) =>
            tag.tagId !== 7 && tag.tagId !== 9 ? (
              <Chip
                key={tag.tagId}
                label={tag.content}
                color="primary"
                style={{ color: 'white' }}
              />
            ) : (
              <React.Fragment
                key={`${tag}-${index}`}
              ></React.Fragment>
            ),
          )}
        </div>
      </div>
    </Card>
  );
}
