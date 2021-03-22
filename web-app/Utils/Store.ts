import { FILTER_BY_ENUM, SEVERITY_ENUM } from './enums';
import { useMemo } from 'react';
import { createStore, Store } from 'redux';
import { ITag } from './types';

export enum ACTION_ENUM {
  EDIT_MODE = 'edit mode',
  FILTER_BY = 'filter by',
  SEARCH_BY_TAGS = 'search by tags',
  SNACKBAR = 'snackbar',
}

export enum SEVERITY_TYPE {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

let store: Store<any>;

export interface IStoreState {
  snackbar: {
    snackbarOpen?: boolean;
    snackbarMessage?: string;
    snackbarSeverity?: SEVERITY_TYPE;
    snackbarDuration?: number;
  };
  selectedTags: ITag[];
  filterBy: FILTER_BY_ENUM;
  editMode: boolean;
}

const initialState: IStoreState = {
  snackbar: {},
  selectedTags: [],
  filterBy: FILTER_BY_ENUM.NONE,
  editMode: false,
};

const reducer = (state = initialState, action: any): IStoreState => {
  switch (action.type) {
    case ACTION_ENUM.SNACKBAR:
      return {
        ...state,
        snackbar: {
          snackbarOpen: true,
          snackbarMessage: action.message,
          snackbarSeverity: action.severity,
          snackbarDuration: action.duration,
        },
      };
    case ACTION_ENUM.FILTER_BY:
      return {
        ...state,
        filterBy: action.filterBy,
      };
    case ACTION_ENUM.SEARCH_BY_TAGS:
      return {
        ...state,
        selectedTags: action.selectedTags,
      };
    case ACTION_ENUM.EDIT_MODE:
      return {
        ...state,
        editMode: action.editMode,
      };
    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(reducer, preloadedState);
}

export const initializeStore = (preloadedState: any) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: IStoreState) {
  const store = useMemo(() => initializeStore(initialState), [
    initialState,
  ]);
  return store;
}
