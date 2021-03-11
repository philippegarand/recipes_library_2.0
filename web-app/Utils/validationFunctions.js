export const apiResponseIsError = (statusCode) => {
  return statusCode > 399 && statusCode < 600;
};
