import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { EditFavorite, EditRating, EditRecipe, GetRecipe } from '../../api/calls';
import {
  IHomeIngredient,
  IIngredient,
  IRecipe,
  IRecipeChanges,
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
  FOR_HOW_MANY_ENUM,
  RECIPE_LENGHT_ENUM,
  SEVERITY_ENUM,
} from '../../Utils/enums';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';

import styles from '../../styles/Recipe.module.css';

export const getServerSideProps: GetServerSideProps = async (context: {
  query: { id: number };
}) => {
  const { id } = context.query;
  const res = await GetRecipe(id[0]);

  return {
    props: {
      recipe: res.success ? res.data : undefined,
      bgImg: '/images/wood_bg.jpg',
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
  const router = useRouter();

  const [recipe, setRecipe] = useState<IRecipe>(props.recipe);
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

  useEffect(() => {
    setRecipe(props.recipe);
  }, [props.recipe]);

  const [openEditText, setOpenEditText] = useState(false);

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
    onSubmit: async (values: FormValues) => {
      let changes: IRecipeChanges = {
        tags: values.tags,
        ingredients: values.ingredients,
        homeIngredients: values.homeIngredients,
        steps: values.steps,
      };

      if (values.title != title) changes['title'] = values.title;
      if (values.forHowMany != forHowMany) changes['forHowMany'] = values.forHowMany;
      if (values.timeToMake != timeToMake) changes['timeToMake'] = values.timeToMake;

      const res = await EditRecipe(id, changes);

      if (res.success) {
        dispatch({
          type: ACTION_ENUM.EDIT_MODE,
          editMode: false,
        });
        dispatch({
          type: ACTION_ENUM.SNACKBAR,
          severity: SEVERITY_ENUM.SUCCESS,
          message: 'Changements sauvegardés!',
        });
        router.replace(router.asPath); // refresh props
      } else {
        dispatch({
          type: ACTION_ENUM.SNACKBAR,
          severity: SEVERITY_ENUM.ERROR,
          message: 'Une erreur est survenue',
        });
      }
    },
  });

  const handleShare = () => {
    //console.log("Share");
  };

  const handleEditSave = () => {
    formik.handleSubmit();
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
          <Card
            className={styles.card}
            style={{
              backgroundImage: `url(${props.bgImg})`,
            }}
          >
            <div>
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
                    onClick={handleShare}
                    fontSize={!isMobile ? 'large' : 'small'}
                  />
                </div>
              </div>
            </div>
            <div style={{ width: '100%' }}>
              <div className={styles.divTitle}>
                {editMode ? (
                  <TextField
                    fullWidth
                    value={formik.values.title}
                    onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  />
                ) : (
                  <Typography variant={isMobile ? 'h6' : 'h4'}>
                    {formik.values.title}
                  </Typography>
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
                        {formik.values.forHowMany}
                      </Typography>
                    )}
                  </div>
                  <div className={styles.iconText}>
                    <Icon
                      icon="AlarmIcon"
                      customColor={clockMap.get(formik.values.timeToMake)?.color}
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
                        {clockMap.get(formik.values.timeToMake)?.text}
                      </Typography>
                    )}
                  </div>
                  <div className={styles.tags}>
                    {editMode ? (
                      <EditTags
                        className={styles.editTags}
                        formik={formik}
                        fullWidth
                      />
                    ) : (
                      formik.values.tags?.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.text}
                          color="primary"
                          style={{ color: 'white' }}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

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
              {formik.values.ingredients ? (
                formik.values.ingredients.map((ing) => (
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
              {formik.values.homeIngredients &&
                formik.values.homeIngredients.map((ahi) => (
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
              {formik.values.steps &&
                formik.values.steps.map((step) => (
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
            ingredients={formik.values.ingredients?.map((x) => ({
              id: x.id,
              text: x.text,
            }))}
            homeIngredients={formik.values.homeIngredients?.map((x) => ({
              id: x.id,
              text: x.text,
            }))}
            steps={formik.values.steps?.map((x) => ({ id: x.id, text: x.text }))}
            saveToFormik={saveToFormik}
            onClose={() => setOpenEditText(false)}
          />
        )}
      </div>
    </>
  );
}
