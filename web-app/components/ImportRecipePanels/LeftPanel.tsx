import React from 'react';
import {
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { FormikProps } from 'formik';
import {
  FOR_HOW_MANY_ENUM,
  RECIPE_LENGHT_ENUM,
} from '../../Utils/enums';
import { Icon } from '..';
import EditForHowMany from '../EditRecipeInfos/EditForHowMany';
import EditLength from '../EditRecipeInfos/EditLength';

import styles from './Panels.module.css';

interface IProps {
  formik: FormikProps<{
    favorite: boolean;
    rating: number;
    recipeLength: RECIPE_LENGHT_ENUM;
    forHowMany: FOR_HOW_MANY_ENUM;
    comments: string;
  }>;
  selectionStep: number;
}

export default function LeftPanel(props: IProps) {
  const { formik, selectionStep } = props;

  const handleFavoriteChange = () => {
    formik.setFieldValue('favorite', !formik.values.favorite);
  };

  const handleRatingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    formik.setFieldValue('rating', e.target.value);
  };

  const handleRecipeLengthChange = (
    event: any,
    newRecipeLength: RECIPE_LENGHT_ENUM,
  ) => {
    if (newRecipeLength) {
      formik.setFieldValue('recipeLength', newRecipeLength);
    }
  };

  const handleForHowManyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    formik.setFieldValue('forHowMany', e.target.value);
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    formik.setFieldValue('comments', e.target.value);
  };

  const steps = [
    {
      number: 0,
      text: 'Titre',
    },
    {
      number: 1,
      text: 'Ingrédients',
    },
    {
      number: 2,
      text: 'Ingrédients communs',
    },
    {
      number: 3,
      text: 'Étapes',
    },
    {
      number: 4,
      text: 'Image',
    },
  ];
  const ratings = [
    {
      value: 10,
      display: '10 - Délicieux',
    },
    {
      value: 9,
      display: '9 - Excellent',
    },
    {
      value: 8,
      display: '8 - Très bon',
    },
    {
      value: 7,
      display: '7 - Bon',
    },
    {
      value: 6,
      display: '6 - Correct',
    },
    {
      value: 5,
      display: '5 - Passable',
    },
    {
      value: 4,
      display: '4 - Pas',
    },
    {
      value: 3,
      display: '3 - Pas bon',
    },
    {
      value: 2,
      display: '2 - Vraiment',
    },
    {
      value: 1,
      display: '1 - Horrible',
    },
    {
      value: 0,
      display: '0 - Aucune',
    },
  ];

  return (
    <List disablePadding>
      {steps.map((step, index) => (
        <ListItem key={index}>
          <ListItemText
            className={styles.listText}
            primary={step.text}
          />
          <ListItemIcon className={styles.listIcon}>
            {selectionStep > step.number ? (
              <Icon icon="CheckBoxOutlinedIcon" color="primary" />
            ) : (
              <Icon icon="CheckBoxOutlineBlankIcon" />
            )}
          </ListItemIcon>
        </ListItem>
      ))}

      <Divider className={styles.divider} />

      <ListItem
        className={styles.clickable}
        onClick={handleFavoriteChange}
      >
        <ListItemText
          className={styles.listText}
          primary="Favoris :"
        />
        <ListItemIcon className={styles.listIcon}>
          {formik.values.favorite ? (
            <Icon icon="FavoriteIcon" customColor="#ff3d47" />
          ) : (
            <Icon icon="FavoriteBorderIcon" />
          )}
        </ListItemIcon>
      </ListItem>

      <ListItem>
        <ListItemText
          className={styles.listTextMargin}
          primary="Note :"
        />
        <FormControl>
          <Select
            labelId="select-rating-label"
            id="select-rating"
            value={formik.values.rating}
            onChange={handleRatingChange}
          >
            {ratings.map((rating, index) => (
              <MenuItem key={index} value={rating.value}>
                {rating.display}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ListItem>

      <ListItem>
        <EditLength
          className={styles.rightSide}
          value={formik.values.recipeLength}
          handleChange={handleRecipeLengthChange}
        />
      </ListItem>

      <ListItem>
        <ListItemText
          className={styles.listTextMargin}
          primary="Pour :"
        />
        <EditForHowMany
          value={formik.values.forHowMany}
          handleChange={handleForHowManyChange}
        />
      </ListItem>

      <ListItem>
        <TextField
          className={styles.rightSide}
          label="Commentaires"
          multiline
          rows={4}
          variant="outlined"
          inputProps={{
            maxLength: 250,
            style: { fontSize: 16 },
          }}
          helperText={`${
            250 - formik.values.comments.length
          } restants`}
          onChange={handleCommentChange}
        />
      </ListItem>
    </List>
  );
}
