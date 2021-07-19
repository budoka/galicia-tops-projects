import { LabeledValue } from 'antd/lib/select';
import { CuentaExterior, Gastos, Ordenante } from './interfaces';

export enum FormNames {
  DATOS_CLIENTE = 'Datos del Cliente',
  DATOS_ORDENANTE = 'Datos del Ordenante',
  CUENTAS = 'Cuentas',
  IMPORTES = 'Importes',
  VARIOS = 'Varios',
  CONFIRMACION = 'Confirmación',
}

//#region Formularios

export interface ClienteForm {
  cuitCliente: string;
}

export interface OrdenanteForm extends Omit<Ordenante, 'tipoPersona' | 'pais' | 'bancoDestino'> {
  tipoPersona: LabeledValue;
  pais: LabeledValue;
}

export interface CuentasForm {
  cuentaOrigen: CuentaExteriorForm;
  cuentaDestino: LabeledValue;
}

export interface ImporteForm {
  importe: number;
  moneda: LabeledValue;
}

export interface VariosForm {
  uetr: string;
  fechaEntrada: moment.Moment;
  gastos: GastosForm;
}

interface CuentaExteriorForm extends CuentaExterior {}

interface GastosForm extends Omit<Gastos, 'detalle' | 'moneda'> {
  detalle: LabeledValue;
  moneda: LabeledValue;
}

//#endregion
