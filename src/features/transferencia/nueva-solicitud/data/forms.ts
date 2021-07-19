import { LabeledValue } from 'antd/lib/select';
import { CuentaExterior, Beneficiario } from './interfaces';

export enum FormNames {
  DATOS_CLIENTE = 'Datos del Cliente',
  DATOS_BENEFICIARIO = 'Datos del Beneficiario',
  CUENTAS = 'Cuentas',
  IMPORTES = 'Importes',
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
export interface CuentasForm {
  cuentaOrigen: LabeledValue;
  cuentaComisiones?: LabeledValue;
  cuentaDestino?: CuentaExteriorForm;
  cuentaIntermediario?: CuentaIntermediariaExteriorForm;
  cuentaIntermediarioHabilitada?: boolean;
}

export interface ImportesForm {
  importes: { importe: number; concepto: LabeledValue }[];
  moneda: LabeledValue;
}

export interface VariosForm {
  fechaEntrada: moment.Moment;
  detalle: LabeledValue;
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
