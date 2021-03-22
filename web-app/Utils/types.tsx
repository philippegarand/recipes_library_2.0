import {
  FOR_HOW_MANY_ENUM,
  RECIPE_LENGHT_ENUM,
  RECIPE_TYPE_ENUM,
} from './enums';

export interface ITag {
  id?: number;
  text?: string;
}

export interface IStep {
  id?: number;
  number: number;
  text: string;
}

export interface IIngredient {
  id?: number;
  number: number;
  text: string;
}

export interface IHomeIngredient {
  id?: number;
  number: number;
  text: string;
}

export interface IComment {
  id?: number;
  text: string;
  commentedOn?: string;
}

export interface IRecipe {
  id?: number;
  title: string;
  timeToMake: RECIPE_LENGHT_ENUM;
  forHowMany: FOR_HOW_MANY_ENUM;
  rating: number;
  favorite: boolean;
  type: RECIPE_TYPE_ENUM;
  pictureData: string;
  ingredients: IIngredient[];
  homeIngredients: IHomeIngredient[];
  steps: IStep[];
  comments: IComment[];
  tags: ITag[];
}

export interface IRecipesQuery {
  perPage: number;
  page: number;
  tagsIds: number[];
  nameLike: string;
  //filterBy: string;
}

export interface IRecipeThumnail {
  id: number;
  title: string;
  timeToMake: RECIPE_LENGHT_ENUM;
  rating: number;
  pictureData: string;
  favorite: boolean;
  type: RECIPE_TYPE_ENUM;
  tags: ITag[];
}

export interface IQueryRes {
  page: number;
  totalPages: number;
  thumbnails: IRecipeThumnail[];
}
