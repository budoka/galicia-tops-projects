import { LabeledValue } from 'antd/lib/select';

export enum FormNames {
  INSTRUCCION = 'Instrucción',
  CONFIRMACION = 'Confirmación',
}

//#region Formularios

export interface SolicitudForm {
  solicitudId: number;
}

export interface InstruccionForm {
  cuentaDestino: LabeledValue;
  cuentaComision: LabeledValue;
  concepto: LabeledValue;
  importe: number;
}

//#endregion
