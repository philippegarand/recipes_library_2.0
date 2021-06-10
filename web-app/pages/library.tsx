import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';
import { ACTION_ENUM, IStoreState } from '../Utils/Store';
import { Icon, Loading, RecipeCard } from '../components';
import { Typography, Fab } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { FILTER_BY_ENUM, ROUTES, SEVERITY_ENUM } from '../Utils/enums';
import { useRouter } from 'next/router';
import { GetRecipesQuery } from '../api/calls';
import { IQueryRes, IRecipesQuery, IRecipeThumnail } from '../Utils/types';

import styles from '../styles/Library.module.css';
import { arraysMatch } from '../Utils/functions';

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await GetRecipesQuery({
    //perPage: 20,
    page: 1,
    tagsIds: [],
    nameLike: '',
    filterBy: FILTER_BY_ENUM.NONE,
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
  const { filterBy, selectedTags } = useSelector((state: IStoreState) => state);
  const isMobile = useMediaQuery(600);
  const router = useRouter();

  const [recipes, setRecipes] = useState<IRecipeThumnail[]>(
    props.initialRecipes?.thumbnails,
  );
  const [totalPages, setTotalPages] = useState<number>(
    props.initialRecipes?.totalPages,
  );
  const [page, setPage] = useState<number>(1);
  //const perPage = 20;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialQuery, setIsInitialQuery] = useState<boolean>(true);

  const [prevTags, setPrevTags] = useState<number[]>([]);
  const [prevNameLike, setPrevNameLike] = useState<string>('');
  const [prevFilter, setPrevFilter] = useState<FILTER_BY_ENUM>(FILTER_BY_ENUM.NONE);

  useEffect(() => {
    const getRecipesThumbnails = async () => {
      setIsLoading(true);

      const tagsIds = selectedTags.filter((t) => t.id !== -1).map((t) => t.id);
      const nameLike = selectedTags.find((t) => t.id === -1)?.text || '';

      // Check need to reset page (something in query changed)
      let resetPage =
        prevFilter != filterBy ||
        prevNameLike != nameLike ||
        !arraysMatch(prevTags, tagsIds);

      const res = await GetRecipesQuery({
        //perPage,
        page: resetPage ? 1 : page,
        tagsIds,
        nameLike,
        filterBy,
      });

      setRecipes(res.data.thumbnails);
      setTotalPages(res.data.totalPages);
      setIsLoading(false);

      // Ugly thing to know if next time we need to reset page
      if (prevFilter != filterBy) setPrevFilter(filterBy);
      if (!arraysMatch(prevTags, tagsIds)) setPrevTags(tagsIds);
      if (prevNameLike != nameLike) setPrevNameLike(nameLike);
      if (resetPage) setPage(1);
    };

    // Ugly thing to prevent weird spam when first loading the page
    if (
      !isInitialQuery ||
      (page !== 1 && !selectedTags.length) ||
      selectedTags.length > 0 ||
      filterBy != FILTER_BY_ENUM.NONE
    ) {
      setIsInitialQuery(false);
      getRecipesThumbnails();
    }
  }, [page, selectedTags, filterBy /*perPage*/]);

  const getRecipesThumbnails = async (query: IRecipesQuery) => {
    setIsLoading(true);

    const res = await GetRecipesQuery(query);

    setRecipes(res.data.thumbnails);
    setTotalPages(res.data.totalPages);

    setIsLoading(false);
  };

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
      <>
        <Head>
          <title>Bibliothèque</title>
        </Head>
        <div className={styles.mainDiv}>
          <Loading />
        </div>
      </>
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
