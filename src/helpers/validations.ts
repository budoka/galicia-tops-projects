export const isFetchingData = (info: object, skip: string[] = []) => {
  return Object.entries(info)
    .filter((entry) => !skip.includes(entry[0]))
    .some((entry) => {
      return entry[1]?.loading;
    });
};

export const hasError = (info: object, skip: string[] = []) => {
  return Object.entries(info)
    .filter((entry) => !skip.includes(entry[0]))
    .some((entry) => {
      return entry[1]?.error;
    });
};
