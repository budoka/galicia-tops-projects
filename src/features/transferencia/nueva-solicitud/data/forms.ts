import { LabeledValue } from 'antd/lib/select';
import { CuentaExterior, Beneficiario } from './interfaces';

export enum FormNames {
  DATOS_CLIENTE = 'Datos del Cliente',
  DATOS_BENEFICIARIO = 'Datos del Beneficiario',
  GASTOS = 'Gastos',
  CUENTAS = 'Cuentas',
  IMPORTES = 'Importes',
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
}

export interface CuentasForm {
  cuentaOrigen: LabeledValue;
  cuentaComisiones?: LabeledValue;
  cuentaDestino?: CuentaExteriorForm;
  cuentaIntermediario?: CuentaIntermediariaExteriorForm;
}

export interface ImportesForm {
  importes: { importe: number; concepto: LabeledValue }[];
  moneda: LabeledValue;
}

interface CuentaExteriorForm extends Omit<CuentaExterior, 'moneda' | 'pais' | 'tipoCodigoBanco'> {
  moneda: LabeledValue;
  pais: LabeledValue;
  tipoCodigoBanco: LabeledValue;
}

interface CuentaIntermediariaExteriorForm extends Omit<CuentaExterior, 'moneda' | 'pais' | 'tipoCodigoBanco'> {
  moneda: LabeledValue;
  pais: LabeledValue;
  tipoCodigoBanco: string;
}

//#endregion
