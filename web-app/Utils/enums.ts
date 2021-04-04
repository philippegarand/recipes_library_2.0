export enum FILTER_BY_ENUM {
  NONE = 'none',
  ALPHA_ORDER = 'alphabetical',
  ALPHA_INORDER = 'alphabetical reversed',
  TIME = 'time',
  RATING = 'rating',
  FAVORITE = 'favorite',
}

export enum FOR_HOW_MANY_ENUM {
  TWO_THREE = '2-3',
  FOUR_FIVE = '4-5',
}

export enum RECIPE_LENGHT_ENUM {
  SHORT = 'Court',
  AVERAGE = 'Moyen',
  LONG = 'Long',
}

export enum RECIPE_TYPE_ENUM {
  OLD = 'Old',
  NEW = 'New',
}

export enum SEVERITY_ENUM {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum ROUTES {
  HOME = '/',
  LIBRARY = '/library',
  RECIPE = '/recipes',
  IMPORT_RECIPE = '/importRecipe',
  NOT_FOUND = '/notFound',
}

export enum DIFF_VALUE {
  VALUE_CREATED = 'created',
  VALUE_UPDATED = 'updated',
  VALUE_DELETED = 'deleted',
  VALUE_UNCHANGED = 'unchanged',
}
