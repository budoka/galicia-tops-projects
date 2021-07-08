import { LabeledValue } from 'antd/lib/select';
import { CuentaExterior, Beneficiario } from './interfaces';

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

export interface BeneficiarioForm extends Omit<Beneficiario, 'fechaNacimiento' | 'tipoPersona' | 'pais' | 'bancoDestino' | 'bancoIntermediario'> {
  fechaNacimiento: moment.Moment;
  tipoPersona: LabeledValue;
  pais: LabeledValue;
}

export interface GastosForm {
  detalle: LabeledValue;
  /* Se calcula en el back
  importe: number;
  monedaId: string;
  swiftCorresponsal: string; 
  */
}

export interface CuentasForm {
  cuentaDebito: LabeledValue;
  cuentaDebitoGastos?: LabeledValue;
  cuentaDestino?: CuentaExterior;
  cuentaIntermediario?: CuentaExterior;
}

export interface ImportesForm {
  importes: { importe: number; concepto: LabeledValue }[];
  moneda: LabeledValue;
}

export interface VariosForm {}

//#endregion
