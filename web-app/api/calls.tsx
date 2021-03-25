import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import {
  IComment,
  IQueryRes,
  IRecipe,
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
            error: `Api error: ${getJsonIndented(
              error.response.data,
            )}`,
          };
    });
};

// --[RecipesController]-----------------------------------------------------------
export const GetRecipesQuery = async (
  query: IRecipesQuery,
): Promise<IApiRes<IQueryRes>> => {
  return await API('POST', 'Recipes/thumbnails', query);
};

export const GetRecipe = async (id: number): Promise<IRecipe> => {
  // TODO: new api call
  return await api.get(`Recipes/${id}`);
};

export const AddRecipe = async (
  recipe: IRecipe,
): Promise<AxiosResponse> => {
  // TODO: new api call
  return await api.post('Recipes', recipe);
};

export const EditRecipe = async (
  recipe: IRecipe,
): Promise<AxiosResponse> => {
  // TODO: new api call
  return await api.put(`Recipes/${recipe.id}`, { recipe });
};

// --[TagsController]--------------------------------------------------------------
export const GetTags = async (): Promise<IApiRes<ITag[]>> => {
  return await API('GET', 'Tags');
};

// TODO: new api call
export const AddTag = async (tag: string): Promise<AxiosResponse> => {
  return await api.post('Tags', JSON.stringify(tag));
};

// --[CommentsController]----------------------------------------------------------
// TODO: new api call
export const AddComment = async (
  comment: IComment,
): Promise<AxiosResponse> => {
  return await api.post('Comments', { comment });
};
