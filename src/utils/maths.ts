export function sumAmounts(amounts: (number | string)[]): number {
  return amounts
    .map((a) => +a)
    .reduce((prev, curr) => {
      let acc = +prev;
      if (curr) acc += +curr;
      return acc;
    }, 0);
}
