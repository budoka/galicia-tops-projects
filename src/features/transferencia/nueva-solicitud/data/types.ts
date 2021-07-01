import { LabeledValue } from 'antd/lib/select';
import { Cliente, DetalleGasto, Keyable, TipoCodigo, TipoPersona } from 'src/features/shared/data/types';
import { BaseState, InfoState } from 'src/features/types';

/**
 * Nueva Solicitud
 */

export enum TransferenciaTabsNames {
  DATOS_CLIENTE = 'Datos del Cliente',
  DATOS_BENEFICIARIO = 'Datos del Beneficiario',
  GASTOS = 'Gastos',
  CUENTAS = 'Cuentas',
  IMPORTES = 'Importes',
  INTERMEDIARIO = 'Intermediario',
  VARIOS = 'Varios',
  CONFIRMACION = 'Confirmación',
}

export interface NuevaSolicitudState extends BaseState {
  info: Partial<NuevaSolicitudInfoState>;
  data: Partial<NuevaSolicitudDataState>;
  ui: NuevaSolicitudUIState;
}

export interface NuevaSolicitudInfoState {
  clientes: InfoState<Cliente[]>;
  cuentas: InfoState<Cuenta[]>;
  conceptos: InfoState<Concepto[]>;
  corresponsales: InfoState<BancoCorresponsal[]>;
  monedas: InfoState<Moneda[]>;
  paises: InfoState<Pais[]>;
}

export interface NuevaSolicitudDataState {
  form: Partial<NuevaSolicitudFormState>;
  extra: Partial<NuevaSolicitudExtraState>;
}

export interface NuevaSolicitudUIState {
  form: { status: StatusForm; active: string };
}

export interface NuevaSolicitudFormState {
  datosOperacion: DatosOperacion;
}

export interface NuevaSolicitudExtraState {}

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
    // TODO lo de abajo se debe habilitar para detalles tipo BEN ?
    /*     importe?: number;
    moneda?: Moneda;
    swiftCorresponsal?: string;
    cuentaCorresponsal?: string; */
  };
  cuentaDebitoGastos?: LabeledValue;
}

export interface CuentasForm {
  cuentaDebito: LabeledValue;
}

export interface ImportesForm {
  importes: { importe: number; concepto: LabeledValue }[];
  moneda: LabeledValue;
  // concepto: LabeledValue;
}

export interface VariosForm {}

//#endregion

export interface StatusForm {
  datosClientes?: boolean;
  datosBeneficiario?: boolean;
  cuentas?: boolean;
  gastos?: boolean;
  importes?: boolean;
  //  varios?: boolean;
}

export interface DatosOperacion {
  fechaEntrada: string;
  cliente?: Cliente;
  beneficiario: Beneficiario;
  bancoIntermediario: Banco;
  cuentaDebito: Cuenta;
  cuentaDebitoGastos?: Cuenta;
  gastos: Gastos;
  importes: Importe[];
  moneda: Moneda;
  vinculadoConBeneficiario?: boolean;
}

export interface Beneficiario {
  tipoPersona: TipoPersonaObj;
  razonSocial?: string;
  nombre?: string;
  apellido?: string;
  nif?: string;
  fechaNacimiento?: string;
  domicilio: Direccion;
  localidad: string;
  codigoPostal: string;
  pais: Pais;
  banco: Banco;
}

export interface TipoPersonaObj {
  id: string;
  descripcion: TipoPersona;
}

export interface Direccion {
  calle: string;
  numero: number;
  piso?: number;
  departamento?: string;
}

export interface Banco {
  nombre: string;
  localidad: string;
  pais: Pais;
  cuenta: string;
  tipoCodigo?: TipoCodigo;
  codigo?: string;
  codigoBanco?: string;
}

export interface Pais extends Keyable {
  id: number;
  nombre: string;
}

/* export interface Cuenta {
  tipoCuenta: TipoCuenta;
  moneda: Moneda;
  numero: string;
} */

export interface Cuenta extends Keyable {
  id: string;
  valor: string;
  codigo: string;
  descripcion: string;
  numero: number;
  moneda: number;
  monedaIso: string;
  saldo: number;
  sucursalAdministradora: number;
}

export interface Gastos {
  detalle: DetalleGastosObj;
  importe?: number;
  moneda?: Moneda;
  swiftCorresponsal?: string;
  cuentaCorresponsal?: string;
}

export interface DetalleGastosObj {
  id: string;
  descripcion: DetalleGasto;
}

export interface Importe {
  importe: number;
  concepto: Concepto;
}

export interface Concepto extends Keyable {
  id: string;
  descripcion: string;
}

export interface BancoCorresponsal extends Keyable {
  id: string;
  nombre: string;
}

export interface Moneda extends Keyable {
  id: string;
  descripcion: string;
}
