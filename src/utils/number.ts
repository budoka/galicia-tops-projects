export function getCurrencyAmount(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2 });
}
