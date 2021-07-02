import { LabeledValue } from 'antd/lib/select';
import { Beneficiario } from './interfaces';

export enum FormNames {
  DATOS_CLIENTE = 'Datos del Cliente',
  DATOS_BENEFICIARIO = 'Datos del Beneficiario',
  GASTOS = 'Gastos',
  CUENTAS = 'Cuentas',
  IMPORTES = 'Importes',
  INTERMEDIARIO = 'Intermediario',
  VARIOS = 'Varios',
  CONFIRMACION = 'Confirmación',
}

//#region Formularios

export interface ClienteForm {
  cuitCliente: string;
  vinculadoConBeneficiario: boolean;
}

export interface BeneficiarioForm extends Omit<Beneficiario, 'fechaNacimiento' | 'tipoPersona' | 'pais'> {
  fechaNacimiento: moment.Moment;
  tipoPersona: LabeledValue;
  pais: LabeledValue;
}

export interface GastosForm {
  gastos: {
    detalle: LabeledValue;
  };
  cuentaDebitoGastos?: LabeledValue;
}

export interface CuentasForm {
  cuentaDebito: LabeledValue;
}

export interface ImportesForm {
  importes: { importe: number; concepto: LabeledValue }[];
  moneda: LabeledValue;
}

export interface VariosForm {}

//#endregion
