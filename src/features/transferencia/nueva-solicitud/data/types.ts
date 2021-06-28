import {
  Cliente,
  ConceptoOpt,
  CuentaOpt,
  CuentaProducto,
  DetalleGasto,
  Keyable,
  MonedaOpt,
  TipoCodigo,
  TipoComision,
  TipoCuenta,
  TipoPersona,
} from 'src/features/shared/data/types';
import { InfoState, BaseState } from 'src/features/types';

/**
 * Nueva Solicitud
 */

export interface NuevaSolicitudState extends BaseState {
  info: Partial<NuevaSolicitudInfoState>;
  data: Partial<NuevaSolicitudDataState>;
}

export interface NuevaSolicitudInfoState {
  clientes: InfoState<Cliente[]>;
  cuentas: InfoState<CuentaProducto[]>;
  conceptos: InfoState<Concepto[]>;
  corresponsales: InfoState<BancoCorresponsal[]>;
  tiposComisiones: InfoState<TipoComision[]>;
  monedas: InfoState<Moneda[]>;
}

export interface NuevaSolicitudDataState {
  form: NuevaSolicitudFormState;
  extra: Partial<NuevaSolicitudExtraState>;
}

export interface NuevaSolicitudFormState {
  datosOperacion: DatosOperacion;
  // datosOperacion: { fields?: DatosOperacion; completed?: boolean };
}

export interface NuevaSolicitudExtraState {
  cliente: Cliente;
}

export interface ClienteForm extends Pick<DatosOperacion, 'cuitCliente'> {}

export interface DatosOperacion {
  fechaEntrada: string;
  cuitCliente: string;
  beneficiario: Beneficiario;
  bancoIntermediario: Banco;
  cuentaDebito: Cuenta;
  cuentaDebitoGasto: Cuenta;
  gasto: Gasto;
  importes: Importe[];
  moneda: Moneda;
  vinculadoConBeneficiario: boolean;
}

export interface Beneficiario {
  tipoPersona: TipoPersona;
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
  id: string;
  nombre: string;
}

export interface Cuenta {
  tipoCuenta: TipoCuenta;
  moneda: Moneda;
  numero: string;
}

export interface Gasto {
  detalle: DetalleGasto;
  importe?: number;
  moneda?: Moneda;
  swiftCorresponsal?: string;
  cuentaCorresponsal?: string;
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
