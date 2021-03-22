import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';
import { IStoreState } from '../Utils/Store';
import { Icon, Loading, RecipeCard } from '../components';
import { Typography, Fab } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import {
  FILTER_BY_ENUM,
  RECIPE_LENGHT_ENUM,
  ROUTES,
} from '../Utils/enums';
import { useRouter } from 'next/router';
import { GetRecipesQuery } from '../api/calls';
import { IQueryRes, IRecipeThumnail } from '../Utils/types';

import styles from '../styles/Library.module.css';

export const getServerSideProps: GetServerSideProps = async (
  context,
) => {
  const res = await GetRecipesQuery({
    perPage: 40,
    page: 1,
    tagsIds: [],
    //filterBy: FILTER_BY_ENUM.NONE,
    nameLike: '',
  });

  return {
    props: {
      initialRecipes: res.data,
    },
  };
};

export default function library(props: {
  initialRecipes: IQueryRes;
  firstGet: boolean;
}) {
  const { filterBy, selectedTags } = useSelector(
    (state: IStoreState) => state,
  );
  const isMobile = useMediaQuery(600);
  const router = useRouter();

  const [recipes, setRecipes] = useState<IRecipeThumnail[]>(
    props.initialRecipes.thumbnails,
  );
  const [totalPages, setTotalPages] = useState<number>(
    props.initialRecipes.totalPages,
  );
  const [page, setPage] = useState<number>(props.initialRecipes.page);
  const perPage = 40;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialQuery, setIsInitialQuery] = useState<boolean>(true);

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
    };

    if (!isInitialQuery || (page !== 1 && !selectedTags.length)) {
      getRecipesThumbnails();
      setIsInitialQuery(false);
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
  }, [filterBy]);

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
          {!recipes.length ? (
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
