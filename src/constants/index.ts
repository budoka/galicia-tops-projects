export const APP_TITLE = 'Selehann Interview';
export const APP_VERSION = require('../../package.json').version;
export const FIXED = 'fixed';
export const STICKY = 'sticky';
export const UNSELECTABLE = 'unselectable';
export const ELLIPSIS = 'ellipsis';
export const SHADOW = 'shadow';

export const DATE_DD_MM_YYYY_FORMAT = 'DD/MM/YYYY';
export const DATETIME_HH_MM_FORMAT = 'DD/MM/YYYY HH:mm';
export const DATETIME_HH_MM_SS_FORMAT = 'DD/MM/YYYY HH:mm:ss';

export const VIEW = {
  MAX_WIDTH: 1250,
};

export class Pattern {
  public static readonly ANY = /^.+$/;
  public static readonly ONLY_NUMBERS = /^\d+$/;
  public static readonly ONLY_WORDS = /^([a-zñáéíóúäëïöü]+( ?[a-zñáéíóúäëïöü])+ ?)$/i;
  public static readonly CURRENCY_AMOUNT = /^[+-]?[0-9]{1,9}(?:\.[0-9]{2})?$/i;
  public static readonly CURRENCY_AMOUNT_POSITIVE = /^[0-9]{1,9}(?:\.[0-9]{2})?$/i;
}

export const LOCALE_ES = 'es-AR';
