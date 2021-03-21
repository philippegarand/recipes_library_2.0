import axios, {
  AxiosError,
  AxiosPromise,
  AxiosResponse,
} from 'axios';
import { IComment, IRecipe, ITag } from '../Utils/types';

const API_BASE_URL = 'http://192.168.0.87:1337';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
});

// --[RecipesController]-----------------------------------------------------------
export const GetRecipe = async (id: number): Promise<IRecipe> => {
  return await api.get(`Recipes/${id}`);
};

export const AddRecipe = async (
  recipe: IRecipe,
): Promise<AxiosResponse> => {
  return await api.post('Recipes', { recipe });
};

export const EditRecipe = async (
  recipe: IRecipe,
): Promise<AxiosResponse> => {
  return await api.put(`Recipes/${recipe.id}`, { recipe });
};

// --[TagsController]--------------------------------------------------------------
export const GetTags = async (): Promise<AxiosResponse<ITag[]>> => {
  return await api.get('Tags');
};

export const AddTag = async (tag: string): Promise<AxiosResponse> => {
  return await api.post('Tags', JSON.stringify(tag));
};

// --[CommentsController]----------------------------------------------------------
export const AddComment = async (
  comment: IComment,
): Promise<AxiosResponse> => {
  return await api.post('Comments', { comment });
};
