import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import {
  IComment,
  IQueryRes,
  IRecipe,
  IRecipeChanges,
  IRecipesQuery,
  IRecipeThumnail,
  ITag,
} from '../Utils/types';

const API_BASE_URL = 'http://192.168.0.87:1337';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
});

interface IApiRes<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const getJsonIndented = (obj: JSON) =>
  JSON.stringify(obj, null, 4).replace(/["{[,\}\]]/g, '');

const API = async (
  method: Method,
  url: string,
  body: any = {},
): Promise<IApiRes<any>> => {
  return await api({ ...api.options, method, url, data: body })
    .then((response: AxiosResponse) => {
      return { success: true, data: response.data };
    })
    .catch((error: AxiosError) => {
      return error.isAxiosError && !error?.response?.data
        ? {
            success: false,
            error: `Axios error: ${error.code}\n${error.stack}`,
          }
        : {
            success: false,
            error: `Api error: ${getJsonIndented(error.response.data)}`,
          };
    });
};

// --[RecipesController]-----------------------------------------------------------
export const GetRecipesQuery = async (
  query: IRecipesQuery,
): Promise<IApiRes<IQueryRes>> => {
  return await API('POST', 'Recipes/thumbnails', query);
};

// TODO: to test
export const GetRecipe = async (id: string): Promise<IApiRes<IRecipe>> => {
  return await API('GET', `Recipes/${id}`);
};

export const AddRecipe = async (
  recipe: IRecipe,
): Promise<IApiRes<{ id: number }>> => {
  return await API('POST', 'Recipes', recipe);
};

export const EditFavorite = async (
  id: number,
  favorite: boolean,
): Promise<IApiRes<any>> => {
  return await API('PATCH', `Recipes/${id}/favorite`, JSON.stringify(favorite));
};

export const EditRating = async (
  id: number,
  rating: number,
): Promise<IApiRes<any>> => {
  return await API('PATCH', `Recipes/${id}/rating`, JSON.stringify(rating));
};

export const AddComment = async (
  recipeId: number,
  comment: string,
): Promise<IApiRes<IComment>> => {
  return await API('POST', `Recipes/${recipeId}/comment`, JSON.stringify(comment));
};

// TODO: to test
export const EditRecipe = async (
  recipeId: number,
  changes: IRecipeChanges,
): Promise<IApiRes<any>> => {
  return await API('PUT', `Recipes/${recipeId}`, JSON.stringify(changes));
};

// --[TagsController]--------------------------------------------------------------
export const GetTags = async (): Promise<IApiRes<ITag[]>> => {
  return await API('GET', 'Tags');
};

export const AddTag = async (tag: string): Promise<IApiRes<ITag>> => {
  return await API('POST', 'Tags', JSON.stringify(tag));
};
