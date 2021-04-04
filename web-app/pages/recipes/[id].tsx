import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { EditFavorite, EditRating, EditRecipe, GetRecipe } from '../../api/calls';
import {
  IHomeIngredient,
  IIngredient,
  IRecipe,
  IStep,
  ITag,
} from '../../Utils/types';
import {
  Box,
  Card,
  Chip,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_ENUM, IStoreState } from '../../Utils/Store';
import { Comments, EditRecipeText, Icon, IconButton } from '../../components';
import {
  EditForHowMany,
  EditLength,
  EditTags,
} from '../../components/EditRecipeInfos';
import useMediaQuery from '../../Utils/CustomHooks/mediaQuery';
import {
  DIFF_VALUE,
  FOR_HOW_MANY_ENUM,
  RECIPE_LENGHT_ENUM,
  SEVERITY_ENUM,
} from '../../Utils/enums';
import { useFormik } from 'formik';

import styles from '../../styles/Recipe.module.css';
import { deepDiffMapper } from '../../Utils/functions';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const res = await GetRecipe(id[0]);

  return {
    props: {
      recipe: res.success ? res.data : undefined,
      bgImg: res.success
        ? backgroundImagesList[
            Math.floor(Math.random() * backgroundImagesList.length)
          ]
        : 0,
    },
  };
};

const useStyles = makeStyles(() => ({
  item: {
    padding: 0,
  },
}));

const clockMap = new Map([
  ['Court', { text: 'Rapide', color: '#00BFFF' }],
  ['Moyen', { text: 'Moyenne', color: 'orange' }],
  ['Long', { text: 'Longue', color: 'red' }],
]);
const backgroundImagesList = [
  '/images/triangles_bg.jpg',
  '/images/wood_bg.jpg',
  '/images/hex_bg.jpg',
  '/images/diamond_bg.jpeg',
  '/images/lines_bg.jpg',
];

interface FormValues {
  title: string;
  forHowMany: FOR_HOW_MANY_ENUM;
  timeToMake: RECIPE_LENGHT_ENUM;
  tags: ITag[];
  ingredients: IIngredient[];
  homeIngredients: IHomeIngredient[];
  steps: IStep[];
}

export default function Recipe(props: { recipe: IRecipe; bgImg: string }) {
  const { editMode } = useSelector((state: IStoreState) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const isMobile = useMediaQuery(600);

  const [recipe, setRecipe] = useState<IRecipe>(props.recipe);
  const [initialState, setInitialState] = useState<FormValues>({
    title: recipe.title,
    forHowMany: recipe.forHowMany,
    timeToMake: recipe.timeToMake,
    tags: recipe.tags,
    ingredients: recipe.ingredients,
    homeIngredients: recipe.homeIngredients,
    steps: recipe.steps,
  });

  const {
    id,
    homeIngredients,
    comments,
    favorite,
    forHowMany,
    ingredients,
    rating,
    steps,
    tags,
    timeToMake,
    title,
  } = recipe;

  const [openEditText, setOpenEditText] = useState(false);
  // const [bgImg] = useState(
  //   backgroundImagesList[
  //     Math.floor(Math.random() * backgroundImagesList.length)
  //   ],
  // );

  const changeFavorite = async () => {
    const res = await EditFavorite(id, !favorite);

    if (!res.success) {
      dispatch({
        type: ACTION_ENUM.SNACKBAR,
        severity: SEVERITY_ENUM.ERROR,
        message: 'Une erreur est survenue',
      });
      return;
    }

    setRecipe({ ...recipe, favorite: !favorite });
  };

  const changeRating = async (newRating: number) => {
    const res = await EditRating(id, newRating);

    if (!res.success) {
      dispatch({
        type: ACTION_ENUM.SNACKBAR,
        severity: SEVERITY_ENUM.ERROR,
        message: 'Une erreur est survenue',
      });
      return;
    }

    setRecipe({ ...recipe, rating: newRating });
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      title,
      forHowMany,
      timeToMake,
      tags,
      ingredients,
      homeIngredients,
      steps,
    },
    onSubmit: async (values) => {
      let diffs = deepDiffMapper.map(initialState, values);

      if (diffs['title'].type === DIFF_VALUE.VALUE_UNCHANGED) delete diffs['title'];
      if (diffs['forHowMany'].type === DIFF_VALUE.VALUE_UNCHANGED)
        delete diffs['forHowMany'];
      if (diffs['timeToMake'].type === DIFF_VALUE.VALUE_UNCHANGED)
        delete diffs['timeToMake'];

      for (var i = Object.keys(diffs['ingredients']).length - 1; i >= 0; i--) {
        const item = diffs['ingredients'][i];
        if (
          (item['id']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['number']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['text']?.type === DIFF_VALUE.VALUE_UNCHANGED) ||
          (item['id']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['number']?.type === DIFF_VALUE.VALUE_UPDATED &&
            item['text']?.type === DIFF_VALUE.VALUE_UNCHANGED)
        )
          delete diffs['ingredients'][i];
      }
      if (!Object.keys(diffs['ingredients']).length) delete diffs['ingredients'];

      for (var i = Object.keys(diffs['homeIngredients']).length - 1; i >= 0; i--) {
        const item = diffs['homeIngredients'][i];
        if (
          (item['id']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['number']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['text']?.type === DIFF_VALUE.VALUE_UNCHANGED) ||
          (item['id']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['number']?.type === DIFF_VALUE.VALUE_UPDATED &&
            item['text']?.type === DIFF_VALUE.VALUE_UNCHANGED)
        )
          delete diffs['homeIngredients'][i];
      }
      if (!Object.keys(diffs['homeIngredients']).length)
        delete diffs['homeIngredients'];

      for (var i = Object.keys(diffs['steps']).length - 1; i >= 0; i--) {
        const item = diffs['steps'][i];
        if (
          (item['id']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['number']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['text']?.type === DIFF_VALUE.VALUE_UNCHANGED) ||
          (item['id']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
            item['number']?.type === DIFF_VALUE.VALUE_UPDATED &&
            item['text']?.type === DIFF_VALUE.VALUE_UNCHANGED)
        )
          delete diffs['steps'][i];
      }
      if (!Object.keys(diffs['steps']).length) delete diffs['steps'];

      for (var i = Object.keys(diffs['tags']).length - 1; i >= 0; i--) {
        const item = diffs['tags'][i];
        if (
          item['id']?.type === DIFF_VALUE.VALUE_UNCHANGED &&
          item['text']?.type === DIFF_VALUE.VALUE_UNCHANGED
        )
          delete diffs['tags'][i];
      }
      if (!Object.keys(diffs['tags']).length) delete diffs['tags'];

      if (!Object.keys(diffs).length) {
        dispatch({
          type: ACTION_ENUM.SNACKBAR,
          severity: SEVERITY_ENUM.INFO,
          message: 'Aucun changements à sauvegarder',
        });
        return;
      }

      console.log('send to api');
      //const res = await EditRecipe(id, diffs);
    },
  });

  const handleEditSave = () => {
    formik.handleSubmit();
    // dispatch({
    //   type: ACTION_ENUM.EDIT_MODE,
    //   editMode: false,
    // });
  };
  const handleEditCancel = () => {
    formik.setFieldValue('title', title);
    formik.setFieldValue('forHowMany', forHowMany);
    formik.setFieldValue('timeToMake', timeToMake);
    formik.setFieldValue('ingredients', ingredients);
    formik.setFieldValue('homeIngredients', homeIngredients);
    formik.setFieldValue('steps', steps);
    formik.setFieldValue('tags', tags);

    dispatch({
      type: ACTION_ENUM.EDIT_MODE,
      editMode: false,
    });
  };

  const saveToFormik = (infos: FormValues) => {
    formik.setFieldValue(
      'ingredients',
      infos.ingredients.map((x, index: number) => ({
        id: x.id,
        number: index + 1,
        text: x.text,
      })),
    );
    formik.setFieldValue(
      'homeIngredients',
      infos.homeIngredients.map((x, index: number) => ({
        id: x.id,
        number: index + 1,
        text: x.text,
      })),
    );
    formik.setFieldValue(
      'steps',
      infos.steps.map((x, index: number) => ({
        id: x.id,
        number: index + 1,
        text: x.text,
      })),
    );
  };

  if (!recipe) {
    return (
      <>
        <Head>
          <title>Recette</title>
        </Head>{' '}
        <div>Une erreur est survenue</div>{' '}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Recette</title>
      </Head>

      <div className={styles.mainDiv}>
        {editMode && (
          <div className={styles.fabs}>
            <Fab color="primary" onClick={handleEditSave}>
              <Icon icon="SaveIcon" customColor="white" />
            </Fab>
            <Fab color="secondary" onClick={handleEditCancel}>
              <Icon icon="CancelIcon" customColor="white" />
            </Fab>
          </div>
        )}
        <div className={styles.recipe}>
          <Card className={styles.card}>
            <div className={styles.topLeft}>
              <div className={styles.imageContainer}>
                <img
                  className={styles.img}
                  src={`data:image/PNG;base64,${recipe.pictureData}`}
                  alt="Recipe Img"
                />
                <div className={styles.likeIcon}>
                  <Icon
                    icon={favorite ? 'FavoriteIcon' : 'FavoriteBorderIcon'}
                    customColor={favorite ? '#ff3d47' : 'white'}
                    onClick={changeFavorite}
                    fontSize={!isMobile ? 'large' : 'small'}
                  />
                </div>
                <div className={styles.shareIcon}>
                  <Icon
                    icon="ShareIcon"
                    customColor="white"
                    onClick={() => console.log('share')}
                    fontSize={!isMobile ? 'large' : 'small'}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundImage: `url(${props.bgImg})`,
                width: '100%',
              }}
            >
              <div className={styles.divTitle}>
                {editMode ? (
                  <TextField
                    fullWidth
                    value={formik.values.title}
                    onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  />
                ) : (
                  <Typography variant="h4">{title}</Typography>
                )}

                <div className={styles.icons}>
                  <Rating
                    className={styles.rating}
                    name="rating"
                    value={rating / 2}
                    precision={0.5}
                    emptyIcon={<Icon icon="StarBorderIcon" fontSize="inherit" />}
                    onChange={(event, newRating) => {
                      changeRating(newRating * 2);
                    }}
                  />
                  <div className={styles.iconText}>
                    <Icon icon="GroupIcon" customColor="#228cdb" />
                    {editMode ? (
                      <EditForHowMany
                        value={formik.values.forHowMany}
                        handleChange={(e) =>
                          formik.setFieldValue('forHowMany', e.target.value)
                        }
                        style={{ marginLeft: 8 }}
                      />
                    ) : (
                      <Typography className={styles.textRightToIcon} variant="body1">
                        {forHowMany}
                      </Typography>
                    )}
                  </div>
                  <div className={styles.iconText}>
                    <Icon
                      icon="AlarmIcon"
                      customColor={clockMap.get(timeToMake)?.color}
                    />
                    {editMode ? (
                      <EditLength
                        className={styles.editLength}
                        value={formik.values.timeToMake}
                        handleChange={(e, newTimeToMake) =>
                          formik.setFieldValue('timeToMake', newTimeToMake)
                        }
                        size="small"
                      />
                    ) : (
                      <Typography className={styles.textRightToIcon} variant="body1">
                        {clockMap.get(timeToMake)?.text}
                      </Typography>
                    )}
                  </div>
                  {!isMobile && (
                    <div className={styles.tags}>
                      {editMode ? (
                        <EditTags formik={formik} fullWidth />
                      ) : (
                        tags?.map((tag) => (
                          <Chip
                            key={tag.id}
                            label={tag.text}
                            color="primary"
                            style={{ color: 'white' }}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* HERE */}
          <div className={styles.ingredients}>
            {editMode ? (
              <div className={styles.sectionTitle}>
                <Typography variant="h5">INGRÉDIENTS</Typography>
                <IconButton
                  icon="EditIcon"
                  color="primary"
                  onClick={() => setOpenEditText(true)}
                />
              </div>
            ) : (
              <Typography variant="h5">INGRÉDIENTS</Typography>
            )}
            <List dense disablePadding>
              {ingredients ? (
                ingredients.map((ing) => (
                  <ListItem
                    key={ing.number}
                    classes={{ root: classes.item }}
                    alignItems="flex-start"
                  >
                    <Icon icon="ArrowRightIcon" customColor="#3CC47C" />
                    <ListItemText primary={ing.text} />
                  </ListItem>
                ))
              ) : (
                <></>
              )}
              <Divider className={styles.divider} />
              {homeIngredients &&
                homeIngredients.map((ahi) => (
                  <ListItem
                    key={ahi.number}
                    classes={{ root: classes.item }}
                    alignItems="flex-start"
                  >
                    <Icon icon="HomeIcon" customColor="#3CC47C" />
                    <ListItemText primary={ahi.text} />
                  </ListItem>
                ))}
            </List>
          </div>

          {/* HERE */}
          <div className={styles.steps}>
            {editMode ? (
              <div className={styles.sectionTitle}>
                <Typography variant="h5">PRÉPARATION</Typography>
                <IconButton
                  icon="EditIcon"
                  color="primary"
                  onClick={() => setOpenEditText(true)}
                />
              </div>
            ) : (
              <Typography variant="h5">PRÉPARATION</Typography>
            )}
            <List dense disablePadding className={styles.steps}>
              {steps &&
                steps.map((step) => (
                  <ListItem key={step.number} classes={{ root: classes.item }}>
                    <ListItemText
                      primary={
                        <Typography component="div" variant="body2">
                          <Box
                            fontWeight="fontWeightMedium"
                            display="inline"
                          >{`${step.number}. `}</Box>
                          {step.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </div>
          <div className={styles.comments}>
            <Comments
              className={styles.comments}
              comments={comments}
              recipeId={id}
            />
          </div>
        </div>

        {openEditText && (
          <EditRecipeText
            editMode
            open={openEditText}
            ingredients={ingredients?.map((x) => ({
              id: x.id,
              text: x.text,
            }))}
            homeIngredients={homeIngredients?.map((x) => ({
              id: x.id,
              text: x.text,
            }))}
            steps={steps?.map((x) => ({ id: x.id, text: x.text }))}
            saveToFormik={saveToFormik}
            onClose={() => setOpenEditText(false)}
          />
        )}
      </div>
    </>
  );
}
