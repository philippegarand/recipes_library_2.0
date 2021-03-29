import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';
import { ACTION_ENUM, IStoreState } from '../Utils/Store';
import { Icon, Loading, RecipeCard } from '../components';
import { Typography, Fab } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import {
  FILTER_BY_ENUM,
  RECIPE_LENGHT_ENUM,
  ROUTES,
  SEVERITY_ENUM,
} from '../Utils/enums';
import { useRouter } from 'next/router';
import { GetRecipesQuery } from '../api/calls';
import { IQueryRes, IRecipeThumnail } from '../Utils/types';

import styles from '../styles/Library.module.css';

export const getServerSideProps: GetServerSideProps = async (
  context,
) => {
  const res = await GetRecipesQuery({
    perPage: 20,
    page: 1,
    tagsIds: [],
    nameLike: '',
  });

  return {
    props: {
      initialRecipes: res.success ? res.data : [],
      error: !res.success && res?.error ? res.error : '',
    },
  };
};

export default function library(props: {
  initialRecipes: IQueryRes;
  error: string;
}) {
  const dispatch = useDispatch();
  const { filterBy, selectedTags } = useSelector(
    (state: IStoreState) => state,
  );
  const isMobile = useMediaQuery(600);
  const router = useRouter();

  const [recipes, setRecipes] = useState<IRecipeThumnail[]>(
    props.initialRecipes?.thumbnails,
  );
  const [totalPages, setTotalPages] = useState<number>(
    props.initialRecipes?.totalPages,
  );
  const [page, setPage] = useState<number>(1);
  const perPage = 20;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialQuery, setIsInitialQuery] = useState<boolean>(true);
  const [gotNewThumbnails, setGotNewThumbnails] = useState<boolean>(
    true,
  );

  useEffect(() => {
    const getRecipesThumbnails = async () => {
      setIsLoading(true);

      const tagsIds = selectedTags
        .filter((t) => t.id !== -1)
        .map((t) => t.id);

      const nameLike =
        selectedTags.find((t) => t.id === -1)?.text || '';

      const res = await GetRecipesQuery({
        perPage,
        page,
        tagsIds,
        nameLike,
      });

      setRecipes(res.data.thumbnails);
      setTotalPages(res.data.totalPages);
      setIsLoading(false);
      setGotNewThumbnails(true);
    };

    if (
      !isInitialQuery ||
      (page !== 1 && !selectedTags.length) ||
      selectedTags.length > 0
    ) {
      setIsInitialQuery(false);
      getRecipesThumbnails();
    }
  }, [perPage, page, selectedTags, isInitialQuery]);

  useEffect(() => {
    const newOrder = [...recipes];

    switch (filterBy) {
      case FILTER_BY_ENUM.ALPHA_ORDER:
        newOrder.sort((a, b) =>
          a.title > b.title ? 1 : b.title > a.title ? -1 : 0,
        );
        break;
      case FILTER_BY_ENUM.ALPHA_INORDER:
        newOrder.sort((a, b) =>
          a.title < b.title ? 1 : b.title < a.title ? -1 : 0,
        );
        break;
      case FILTER_BY_ENUM.FAVORITE:
        newOrder.sort((a, b) =>
          a.favorite < b.favorite
            ? 1
            : b.favorite < a.favorite
            ? -1
            : 0,
        );
        break;
      case FILTER_BY_ENUM.RATING:
        newOrder.sort((a, b) =>
          a.rating < b.rating ? 1 : b.rating < a.rating ? -1 : 0,
        );
        break;
      case FILTER_BY_ENUM.TIME:
        newOrder.sort((a, b) =>
          Object.values(RECIPE_LENGHT_ENUM).indexOf(a.timeToMake) >
          Object.values(RECIPE_LENGHT_ENUM).indexOf(b.timeToMake)
            ? 1
            : Object.values(RECIPE_LENGHT_ENUM).indexOf(
                b.timeToMake,
              ) >
              Object.values(RECIPE_LENGHT_ENUM).indexOf(a.timeToMake)
            ? -1
            : 0,
        );
        break;
      default:
        newOrder.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0,
        );
        break;
    }

    setRecipes(newOrder);
    setGotNewThumbnails(false);
  }, [filterBy, page, gotNewThumbnails]);

  useEffect(() => {
    if (!props.error) return;
    dispatch({
      type: ACTION_ENUM.SNACKBAR,
      severity: SEVERITY_ENUM.ERROR,
      message: 'Une erreur est survenue, voir la console',
      duration: 10000,
    });
    console.log(props.error);
  }, [props.error]);

  if (isLoading) {
    return (
      <div className={styles.mainDiv}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Bibliothèque</title>
      </Head>

      <div className={styles.mainDiv}>
        <div className={styles.recipes}>
          {!recipes?.length ? (
            <Typography className={styles.noResult}>
              Aucun résultat pour cette recherche...
            </Typography>
          ) : (
            <div className={styles.displayCards}>
              {recipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}
          <Fab
            className={styles.fab}
            color="primary"
            onClick={() => router.push(ROUTES.IMPORT_RECIPE)}
          >
            <Icon icon="AddIcon" customColor="white" />
          </Fab>
        </div>
        <div className={styles.pagination}>
          <Pagination
            count={totalPages === 1 ? 0 : totalPages}
            color="primary"
            size={isMobile ? 'small' : 'large'}
            onChange={(e, page) => setPage(page)}
            page={page}
            variant="outlined"
          />
        </div>
      </div>
    </>
  );
}
