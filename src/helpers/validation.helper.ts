/**
 * Check if there is any data fetching
 * @param info
 * @param skip
 * @returns
 */
export const isFetchingData = (info: object, skip: string[] = []) => {
  return Object.entries(info)
    .filter((entry) => !skip.includes(entry[0]))
    .some((entry) => {
      return entry[1]?.loading;
    });
};

/**
 * Check if there is any error on fetching
 * @param info
 * @param skip
 * @returns
 */
export const hasError = (info: object, skip: string[] = []) => {
  return Object.entries(info)
    .filter((entry) => {
      return !skip.includes(entry[0]);
    })
    .some((entry) => {
      return entry[1]?.error;
    });
};
