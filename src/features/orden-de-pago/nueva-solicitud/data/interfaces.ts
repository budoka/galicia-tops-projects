import { Cliente, Cuenta, InfoState, Keyable, Moneda, Pais } from 'src/features/_shared/data/interfaces';
import { DetalleGastos as DetalleGastoType, TipoPersona as TipoPersonaType } from 'src/features/_shared/data/types';

export interface NuevaSolicitudState {
  info: Partial<NuevaSolicitudInfoState>;
  data: Partial<NuevaSolicitudDataState>;
  ui: NuevaSolicitudUIState;
}

export interface NuevaSolicitudInfoState {
  clientes: InfoState<Cliente[]>;
  cuentas: InfoState<Cuenta[]>;
  solicitudCreada: InfoState<boolean>;
}

export interface NuevaSolicitudDataState {
  form: Partial<NuevaSolicitudFormState>;
}

export interface NuevaSolicitudUIState {
  form: { status: StatusForms; active: string };
}

export interface NuevaSolicitudFormState {
  uetr: string;
  detalles: Detalles;
}

export interface StatusForms {
  datosClientes?: boolean;
  datosOrdenante?: boolean;
  cuentas?: boolean;
  importe?: boolean;
  varios?: boolean;
}

export interface Detalles {
  fechaEntrada: string;
  cliente?: Cliente;
  ordenante: Ordenante;
  cuentaDestino: Cuenta;
  gastos: Gastos;
  importe: number;
  moneda: Moneda;
}

export interface Ordenante {
  tipoPersona: TipoPersona;
  razonSocial?: string;
  nombre?: string;
  apellido?: string;
  pais: Pais;
  cuentaOrigen: CuentaExterior;
}

export interface TipoPersona {
  id: string;
  descripcion: TipoPersonaType;
}

export interface CuentaExterior {
  swiftBanco: string;
  numero: string;
}

export interface Gastos {
  detalle: DetalleGastos;
  importe: number;
  moneda: Moneda;
  swiftCorresponsal: string;
}

export interface DetalleGastos {
  id: string;
  descripcion: DetalleGastoType;
}
