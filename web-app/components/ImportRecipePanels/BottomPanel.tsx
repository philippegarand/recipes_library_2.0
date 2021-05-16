import React from 'react';
import {
  CircularProgress,
  makeStyles,
  MobileStepper,
  Typography,
} from '@material-ui/core';
import { Button } from '..';

import styles from './Panels.module.css';

const useStyles = makeStyles({
  root: {
    width: '25rem',
    padding: 0,
    marginTop: '0.5rem',
    flexGrow: 1,
    color: '#3CC47C',
  },
  progress: {
    width: '100%',
    height: '0.5rem',
  },
});

interface IProps {
  selectionStep: number;
  ocrDone: boolean;
  editDone: boolean;
  handleNext: React.MouseEventHandler<HTMLButtonElement>;
  handleAddRecipe: React.MouseEventHandler<HTMLButtonElement>;
}

const steps = [
  'Sélectionnez le titre',
  'Sélectionnez les ingrédients',
  'Sélectionnez les ingrédients communs',
  'Sélectionnez les étapes',
  "Sélectionnez l'image de la recette",
  'Entrez les informations nécessaires à gauche et les catégories (optionel)',
];

export default function BottomPanel(props: IProps) {
  const { selectionStep, handleNext, ocrDone, editDone, handleAddRecipe } = props;
  const classes = useStyles();

  return (
    <div className={styles.stepper}>
      <Typography>{steps[selectionStep]}</Typography>
      <MobileStepper
        classes={{ root: classes.root, progress: classes.progress }}
        variant="progress"
        steps={steps.length}
        position="static"
        activeStep={selectionStep}
        backButton={<></>}
        nextButton={<></>}
      />

      {!ocrDone && selectionStep > 3 ? (
        <div className={styles.ocrProgress}>
          <CircularProgress className={styles.loadingSpinner} size="24px" />
          <Typography
            variant="caption"
            style={{ textAlign: 'center', marginLeft: 8 }}
          >
            Reconnaissance du texte en cours...
          </Typography>
        </div>
      ) : (
        <></>
      )}
      <div className={styles.buttons}>
        <Button
          variant={editDone ? 'outlined' : 'contained'}
          color="primary"
          style={{ color: editDone ? '#3CC47C' : 'white' }}
          disabled={selectionStep < 5 || !ocrDone}
          onClick={handleNext}
          endIcon="EditIcon"
        >
          Modifier texte
        </Button>
        {editDone ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRecipe}
            endIcon="AddIcon"
          >
            Ajouter la recette
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
