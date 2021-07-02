import { BancoCorresponsal, Cliente, Concepto, InfoState, Keyable, Moneda, Pais } from 'src/features/_shared/data/interfaces';
import { DetalleGasto as DetalleGastoType, TipoCodigo, TipoPersona as TipoPersonaType } from 'src/features/_shared/data/types';

export interface NuevaSolicitudState {
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
}

export interface NuevaSolicitudUIState {
  form: { status: StatusForms; active: string };
}

export interface NuevaSolicitudFormState {
  datosOperacion: DatosOperacion;
}

export interface StatusForms {
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

export interface TipoPersona {
  id: string;
  descripcion: TipoPersonaType;
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
  detalle: DetalleGastos;
  importe?: number;
  moneda?: Moneda;
  swiftCorresponsal?: string;
  cuentaCorresponsal?: string;
}

export interface DetalleGastos {
  id: string;
  descripcion: DetalleGastoType;
}

export interface Importe {
  importe: number;
  concepto: Concepto;
}
