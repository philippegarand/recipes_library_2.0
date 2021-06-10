import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
  TextField,
  Typography,
} from '@material-ui/core';
import Draggable from 'react-draggable';
import { useFormik } from 'formik';
import { ListReorder, Button } from '..';
import { useDispatch } from 'react-redux';
import { SEVERITY_ENUM } from '../../Utils/enums';
import { ACTION_ENUM } from '../../Utils/Store';

import styles from './EditRecipeText.module.css';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

interface FormValue {
  title: string;
  ingredients: { id?: number; text: string }[];
  homeIngredients: { id?: number; text: string }[];
  steps: { id?: number; text: string }[];
}

interface IProps {
  editMode?: boolean;
  open: boolean;
  title?: string;
  ingredients: { id?: number; text: string }[];
  homeIngredients: { id?: number; text: string }[];
  steps: { id?: number; text: string }[];
  saveToFormik: Function;
  onClose: any;
  onEditDone?: Function;
}

export default function EditRecipeText(props: IProps) {
  const {
    editMode = false,
    open,
    title,
    ingredients,
    homeIngredients,
    steps,
    saveToFormik,
    onClose,
    onEditDone,
  } = props;

  const dispatch = useDispatch();

  const validate = (values: FormValue) => {
    const { title, ingredients, homeIngredients, steps } = values;

    const errors = {
      title: '',
      ingredients: Array(ingredients.length).fill(''),
      homeIngredients: Array(homeIngredients.length).fill(''),
      steps: Array(steps.length).fill(''),
    };

    if (!editMode && !title) {
      errors.title = 'Le nom de la recette est obligatoire';
    }

    for (let index = 0; index < ingredients.length; index++) {
      if (!ingredients[index].text) {
        errors.ingredients[index] = 'Ne peut pas être vide';
      } else if (ingredients[index].text.indexOf('%') > -1) {
        errors.ingredients[index] =
          "Présence de '%', c'est probablement une fraction";
      } else if (ingredients[index].text.indexOf('"') > -1) {
        errors.ingredients[index] =
          'Présence d\'un caractère interdit : " (double quote)';
      }
    }

    for (let index = 0; index < homeIngredients.length; index++) {
      if (!homeIngredients[index].text) {
        errors.homeIngredients[index] = 'Ne peut pas être vide';
      } else if (homeIngredients[index].text.indexOf('%') > -1) {
        errors.homeIngredients[index] =
          "Présence de '%', c'est probablement une fraction";
      } else if (homeIngredients[index].text.indexOf('"') > -1) {
        errors.homeIngredients[index] =
          'Présence d\'un caractère interdit : " (double quote)';
      }
    }

    for (let index = 0; index < steps.length; index++) {
      if (!steps[index].text) {
        errors.steps[index] = 'Ne peut pas être vide';
      } else if (/^\d/.test(steps[index].text)) {
        errors.steps[index] = 'Ne doit pas être numérotée, mais simplement en ordre';
      } else if (steps[index].text.indexOf('%') > -1) {
        errors.steps[index] = "Présence de '%', c'est probablement une fraction";
      } else if (steps[index].text.indexOf('"') > -1) {
        errors.steps[index] = 'Présence d\'un caractère interdit : " (double quote)';
      }
    }

    if (
      errors.title.length ||
      errors.ingredients.some((x) => x.length > 0) ||
      errors.homeIngredients.some((x) => x.length > 0) ||
      errors.steps.some((x) => x.length > 0)
    ) {
      dispatch({
        type: ACTION_ENUM.SNACKBAR,
        severity: SEVERITY_ENUM.WARNING,
        message: 'Certains champs ont des erreurs',
      });
      return errors;
    }

    return {};
  };

  const formik = useFormik({
    initialValues: {
      title,
      ingredients,
      homeIngredients,
      steps,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { title, ingredients, homeIngredients, steps } = values;

      const data = {
        ingredients: ingredients.map((i) => ({
          ...i,
          text: i.text.trim(),
        })),
        homeIngredients: homeIngredients.map((i) => ({
          ...i,
          text: i.text.trim(),
        })),
        steps: steps.map((i) => ({ ...i, text: i.text.trim() })),
      };

      saveToFormik(editMode ? data : { ...data, title: title.trim() });

      if (!editMode) onEditDone();
      onClose();
    },
  });

  const handleOnChangeTitle = (e) => {
    formik.setFieldValue('title', e.target.value);
  };
  // TODO: not the best for performences, but does the job...
  const handleOnChangeIngredients = (newIngredients) => {
    formik.setFieldValue('ingredients', newIngredients);
  };
  const handleOnChangeHomeIngredients = (newHomeIngredients) => {
    formik.setFieldValue('homeIngredients', newHomeIngredients);
  };
  const handleOnChangeSteps = (newSteps) => {
    formik.setFieldValue('steps', newSteps);
  };

  if (!open) {
    return <></>;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Modifier les informations de la recette
      </DialogTitle>

      <DialogContent dividers>
        <div className={editMode ? styles.editMode : styles.addMode}>
          {!editMode && (
            <div className={styles.title}>
              <Typography variant="h5">Nom</Typography>
              <TextField
                value={formik.values.title}
                multiline
                InputProps={{
                  style: { fontSize: 16 },
                }}
                fullWidth
                onChange={handleOnChangeTitle}
                error={Boolean(formik.errors['title'])}
                helperText={formik.errors['title']}
              />
            </div>
          )}

          <ListReorder
            className={styles.ingredients}
            title="Ingrédients"
            items={formik.values.ingredients}
            onChange={handleOnChangeIngredients}
            errors={formik.errors['ingredients'] as string[]}
          />
          <ListReorder
            className={styles.homeIngredients}
            title="Ingrédients Communs"
            items={formik.values.homeIngredients}
            onChange={handleOnChangeHomeIngredients}
            errors={formik.errors['homeIngredients'] as string[]}
          />
          <ListReorder
            className={styles.steps}
            title="Étapes"
            items={formik.values.steps}
            onChange={handleOnChangeSteps}
            errors={formik.errors['steps'] as string[]}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onClose} style={{ color: '#C90E0E' }}>
          Fermer
        </Button>
        <Button
          variant="text"
          onClick={() => formik.handleSubmit()}
          style={{ color: '#3CC47C' }}
        >
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
