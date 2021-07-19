//#region Formularios

import { LabeledValue } from 'antd/lib/select';
import { Filtros } from './interfaces';

export interface FiltrosForm extends Omit<Filtros, 'moneda' | 'rangoFecha'> {
  moneda: LabeledValue;
  rangoFecha: moment.Moment[];
}

//#endregion
