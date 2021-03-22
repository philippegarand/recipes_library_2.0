import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Card } from '@material-ui/core';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { EditRecipeText, Button, IconButton } from '../components';
import AlertDialog from '../components/AlertDialog';
import {
  RECIPE_TYPE_ENUM,
  RECIPE_LENGHT_ENUM,
  FOR_HOW_MANY_ENUM,
  SEVERITY_ENUM,
  ROUTES,
} from '../Utils/enums';
import { ACTION_ENUM } from '../Utils/Store';
import { apiResponseIsError } from '../Utils/validationFunctions';
import { useRouter } from 'next/router';
import { IRecipe, ITag } from '../Utils/types';
import { AddRecipe } from '../api/calls';
import Head from 'next/head';

import LeftPanelControls from '../components/ImportRecipePanels/LeftPanel';
import BottomPanelControls from '../components/ImportRecipePanels/BottomPanel';
import RightPanelControls from '../components/ImportRecipePanels/RightPanel';

import styles from '../styles/ImportRecipe.module.css';

// Image crop
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Tesseract OCR
import { createWorker, createScheduler } from 'tesseract.js';

export async function getStaticProps() {
  return {
    props: {},
  };
}

const pixelRatio = 1; // window.devicePixelRatio || 1;

const blobNames = [
  'title',
  'ingredients',
  'home ingredients',
  'steps',
  'picture',
];

interface formikAfterOcr {
  title?: string;
  ingredients?: string[];
  homeIngredients?: string[];
  steps?: string[];
}

interface formikValues {
  title: string;
  ingredients: string[];
  homeIngredients: string[];
  steps: string[];
  favorite: boolean;
  rating: number;
  recipeLength: RECIPE_LENGHT_ENUM;
  forHowMany: FOR_HOW_MANY_ENUM;
  comments: string;
  tags: ITag[];
}

export default function importRecipe() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [recipeType, setRecipeType] = useState<RECIPE_TYPE_ENUM>(
    RECIPE_TYPE_ENUM.OLD,
  );
  const [selectionStep, setSelectionStep] = useState<number>(0);
  const [startedOcr, setStartedOcr] = useState<boolean>(false);
  const [ocrDone, setOcrDone] = useState<boolean>(false);
  const [editOcr, setEditOcr] = useState<boolean>(false);
  const [editDone, setEditDone] = useState<boolean>(false);
  const [cropBlobs, setCropBlobs] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [
    formikAfterOcr,
    setFormikAfterOcr,
  ] = useState<formikAfterOcr>({});

  const [uploadedImage, setUploadedImage] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crops, setCrops] = useState([{}, {}, {}, {}, {}, {}]);
  const [completedCrops, setCompletedCrops] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      ingredients: [],
      homeIngredients: [],
      steps: [],
      favorite: false,
      rating: 0,
      recipeLength: RECIPE_LENGHT_ENUM.AVERAGE,
      forHowMany: FOR_HOW_MANY_ENUM.FOUR_FIVE,
      comments: '',
      tags: [],
    },
    onSubmit: async (values: formikValues) => {
      const {
        title,
        ingredients,
        homeIngredients,
        steps,
        favorite,
        rating,
        recipeLength,
        forHowMany,
        comments,
        tags,
      } = values;

      let pictureBase64;
      await blobToBase64(cropBlobs[4]).then((res: string) => {
        pictureBase64 = res.substring(22); //removes "data:image/png;base64,"
      });

      const recipe: IRecipe = {
        title: title,
        timeToMake: recipeLength,
        forHowMany: forHowMany,
        rating: rating,
        pictureData: pictureBase64,
        favorite: favorite,
        type: recipeType,
        tags: tags.map((t) => ({ id: t.id, text: t.text })),
        ingredients: ingredients.map((i, index) => ({
          number: index + 1,
          text: i,
        })),
        homeIngredients: homeIngredients.map((i, index) => ({
          number: index + 1,
          text: i,
        })),
        steps: steps.map((s, index) => ({
          number: index + 1,
          text: s,
        })),
        comments: comments ? [{ text: comments }] : [],
      };

      const res = await AddRecipe(recipe);

      if (apiResponseIsError(res.status)) {
        dispatch({
          type: ACTION_ENUM.SNACKBAR,
          severity: SEVERITY_ENUM.ERROR,
          message: 'Une erreur est survenue',
        });
        return;
      }

      dispatch({
        type: ACTION_ENUM.SNACKBAR,
        severity: SEVERITY_ENUM.SUCCESS,
        message: 'Recette importée!',
      });

      setOpenAlert(true);
    },
  });

  // everything set, add through formik!
  const handleAddRecipe = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  // When a selection is made, convert result to blob
  useEffect(() => {
    // do nothing at first
    if (selectionStep === 0) {
      return;
    }

    const ocr = async () => {
      setStartedOcr(true);
      const scheduler = createScheduler();
      const worker = createWorker({
        //logger: (m) => console.log(m),
      });

      await worker.load();
      await worker.loadLanguage('fra');
      await worker.initialize('fra');
      scheduler.addWorker(worker);

      const results = await Promise.all(
        cropBlobs
          .slice(0, -1)
          .map((blob) => scheduler.addJob('recognize', blob)),
      );

      await scheduler.terminate();

      setFormikAfterOcr({
        title: results[0].data.text.replace(/\n/g, ' ').trim(),
        ingredients: results[1].data.paragraphs.map((i) =>
          i.text.replace(/\n/g, ' ').trim(),
        ),
        homeIngredients: results[2].data.paragraphs.map((i) =>
          i.text.replace(/\n/g, ' ').trim(),
        ),
        steps: results[3].data.paragraphs.map((i) =>
          i.text
            .replace(/\n/g, ' ')
            .replace(/^\d+\.\s*/, '')
            .trim(),
        ),
      });

      setOcrDone(true);
    };

    // when all text crop are made, start ocr
    if (!startedOcr && selectionStep === 4 && !ocrDone) {
      ocr();
    }
  }, [selectionStep, cropBlobs, ocrDone, startedOcr]);

  const onSelectFile = useCallback(
    (e, recipeType: RECIPE_TYPE_ENUM) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => setUploadedImage(reader.result),
          // @ts-ignore
          setRecipeType(recipeType),
        );
        reader.readAsDataURL(e.target.files[0]);
        const newCrops = crops.slice();
        newCrops[4] = {
          aspect: recipeType === RECIPE_TYPE_ENUM.NEW ? 3 : 16 / 10,
        };

        setCrops(newCrops);
      }
    },
    [crops],
  );

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (
      !completedCrops ||
      !previewCanvasRef.current ||
      !imgRef.current
    ) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrops[selectionStep];

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
  }, [completedCrops, selectionStep]);

  const handleAcceptCrop = useCallback(async () => {
    if (!previewCanvasRef.current) {
      return;
    }

    // convert crop to blob
    const newArray = [...cropBlobs];
    newArray[selectionStep] = await new Promise((resolve, reject) => {
      previewCanvasRef.current.toBlob(
        (blob) => {
          blob.name = blobNames[selectionStep];
          resolve(blob);
        },
        'image/png',
        1,
      );
    });

    setCropBlobs(newArray);
    setSelectionStep(selectionStep + 1);
  }, [selectionStep, cropBlobs]);

  const handleRefuseCrop = useCallback(() => {
    if (!previewCanvasRef.current) {
      return;
    }

    const newArray = [...completedCrops];
    newArray[selectionStep] = null;
    setCompletedCrops(newArray);
  }, [selectionStep, completedCrops]);

  const UploadButton = useMemo(() => {
    return !uploadedImage ? (
      <div className={styles.uploadButtonsContainer}>
        <Button
          className={styles.uploadButton}
          variant="outlined"
          color="primary"
          endIcon="CloudUploadIcon"
          size="large"
          // @ts-ignore
          component="label"
        >
          Ancienne recette
          <input
            type="file"
            name="file"
            accept="image/png, image/jpeg"
            onChange={(e) => onSelectFile(e, RECIPE_TYPE_ENUM.OLD)}
            hidden
          />
        </Button>
        <Button
          className={styles.uploadButton}
          variant="outlined"
          color="primary"
          endIcon="CloudUploadIcon"
          size="large"
          // @ts-ignore
          component="label"
        >
          Nouvelle recette
          <input
            type="file"
            name="file"
            accept="image/png, image/jpeg"
            onChange={(e) => onSelectFile(e, RECIPE_TYPE_ENUM.NEW)}
            hidden
          />
        </Button>
      </div>
    ) : (
      <></>
    );
  }, [uploadedImage, onSelectFile]);

  const centerDivRef = useRef(null);

  const UploadedImage = useMemo(() => {
    const handleImageKeyDown = (
      e: React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (e.key === 'y') {
        handleAcceptCrop();
      }
      if (e.key === 'n') {
        handleRefuseCrop();
      }
    };

    const saveToFormik = (infos) => {
      formik.setFieldValue('title', infos.title);
      formik.setFieldValue('ingredients', infos.ingredients);
      formik.setFieldValue('homeIngredients', infos.homeIngredients);
      formik.setFieldValue('steps', infos.steps);
    };

    return uploadedImage ? (
      <div
        className={[styles.centerScreen].join(' ')}
        onKeyDown={handleImageKeyDown}
        ref={centerDivRef}
      >
        <ReactCrop
          imageStyle={{
            maxWidth: centerDivRef.current?.clientWidth,
            maxHeight: centerDivRef.current?.clientHeight,
          }}
          src={uploadedImage}
          disabled={selectionStep === 5}
          crop={crops[selectionStep]}
          onImageLoaded={onLoad}
          onChange={(c) => {
            const newArray = [...crops];
            newArray[selectionStep] = c;
            setCrops(newArray);
          }}
          onComplete={(c: any) => {
            const newArray = [...completedCrops];
            newArray[selectionStep] = c;
            setCompletedCrops(newArray);
          }}
        />
        {editOcr ? (
          <EditRecipeText
            title={formik.values.title}
            ingredients={formik.values.ingredients}
            homeIngredients={formik.values.homeIngredients}
            steps={formik.values.steps}
            open={editOcr}
            saveToFormik={saveToFormik}
            onClose={() => setEditOcr(false)}
            onEditDone={() => setEditDone(true)}
          />
        ) : null}
      </div>
    ) : (
      <></>
    );
  }, [
    uploadedImage,
    crops,
    selectionStep,
    completedCrops,
    onLoad,
    handleAcceptCrop,
    handleRefuseCrop,
    formik,
    editOcr,
  ]);

  const LeftPanel = useMemo(() => {
    return uploadedImage ? (
      <div
        className={[styles.leftScreen, styles.paddingTop].join(' ')}
      >
        <LeftPanelControls
          formik={formik}
          selectionStep={selectionStep}
        />
      </div>
    ) : (
      <div className={styles.leftScreen} />
    );
  }, [uploadedImage, formik, selectionStep]);

  const RightPanel = useMemo(() => {
    return uploadedImage ? (
      <div
        className={[styles.rightScreen, styles.paddingTop].join(' ')}
      >
        <RightPanelControls formik={formik} />
      </div>
    ) : (
      <div className={styles.rightScreen} />
    );
  }, [uploadedImage, formik]);

  const BottomPanel = useMemo(() => {
    const handleNext = async () => {
      formik.setFieldValue('title', formikAfterOcr.title);
      formik.setFieldValue('ingredients', formikAfterOcr.ingredients);
      formik.setFieldValue(
        'homeIngredients',
        formikAfterOcr.homeIngredients,
      );
      formik.setFieldValue('steps', formikAfterOcr.steps);

      setEditOcr(true);
    };

    return uploadedImage ? (
      <div className={styles.bottomScreen}>
        <BottomPanelControls
          selectionStep={selectionStep}
          handleNext={handleNext}
          ocrDone={ocrDone}
          editDone={editDone}
          handleAddRecipe={handleAddRecipe}
        />
      </div>
    ) : (
      <div className={styles.bottomScreen} />
    );
  }, [
    uploadedImage,
    selectionStep,
    ocrDone,
    formik,
    formikAfterOcr,
    editDone,
    handleAddRecipe,
  ]);

  const handleAlertClose = () => {
    setOpenAlert(false);
    router.push(ROUTES.HOME);
  };

  return (
    <>
      <Head>
        <title>Importation</title>
      </Head>

      <div className={styles.mainDiv}>
        <div className={styles.importGrid}>
          {UploadButton}
          {LeftPanel}
          {UploadedImage}
          {RightPanel}
          {BottomPanel}
        </div>
        {completedCrops[selectionStep] &&
        completedCrops[selectionStep]?.width !== 0 &&
        completedCrops[selectionStep]?.height !== 0 ? (
          <div className={styles.selectionPreview}>
            <div className={styles.selectionButtons}>
              <IconButton
                icon="CheckCircleIcon"
                style={{ color: '#3CC47C' }}
                fontSize="large"
                onClick={handleAcceptCrop}
              />
              <IconButton
                icon="CancelIcon"
                style={{ color: '#C90E0E' }}
                fontSize="large"
                onClick={handleRefuseCrop}
              />
            </div>
            <Card className={styles.selectionPreviewCard}>
              <canvas
                ref={previewCanvasRef}
                style={{
                  display: 'block',
                  width: Math.round(
                    completedCrops[selectionStep]?.width ?? 0,
                  ),
                  height: Math.round(
                    completedCrops[selectionStep]?.height ?? 0,
                  ),
                }}
              />
            </Card>
          </div>
        ) : (
          <></>
        )}
        <AlertDialog
          yesNo
          title="Voulez-vous importer une autre recette?"
          open={openAlert}
          handleYes={() => router.reload()}
          handleClose={() => handleAlertClose()}
        />
      </div>
    </>
  );
}
