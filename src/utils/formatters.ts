import moment from 'moment';

export function formatCurrencyAmount(amount: number | string, currency?: string): string {
  if (typeof amount === 'string') amount = Number(amount);
  amount = amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  if (currency) amount += ' ' + currency;
  return amount;
}

export function formatDate(value: string | moment.Moment, format: 'DD/MM/YYYY' | 'DD/MM/YYYY hh:mm'): string {
  if (typeof value === 'string') value = moment(value);
  return value.format(format);
}
