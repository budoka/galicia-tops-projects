import { Banco, Concepto, Cuenta, Moneda, Cliente, TipoComision } from 'src/features/shared/types';
import { InfoState } from 'src/features/types';

/**
 * Nueva Solicitud
 */

export interface NuevaSolicitudState {
  info: NuevaSolicitudInfoState;
  data: NuevaSolicitudDataState;
}

export interface NuevaSolicitudInfoState {
  personas: InfoState<Cliente>[];
  cuentas: InfoState<CuentaProducto>[];
  conceptos: InfoState<Concepto>[];
  corresponsales: InfoState<Banco>[];
  tiposComisiones: InfoState<TipoComision>[];
  monedas: InfoState<Moneda>[];
}

export interface NuevaSolicitudDataState {
  form: NuevaSolicitudFormState;
  extra: NuevaSolicitudExtraState;
}

export interface NuevaSolicitudFormState {
  fecha: moment.Moment;
  datosCliente: DatosCliente;
  datosBeneficiario: DatosBeneficiario;
  corresponsal: Banco;
  tipoComision: TipoComision;
  concepto: Concepto;
  importe: number;
  moneda: Moneda;
}

export interface NuevaSolicitudExtraState {
  persona: Cliente;
  cuenta: Cuenta;
}

export interface DatosCliente {
  cuit: string;
  cuenta: string;
  banco: string; //Banco;
}

export interface DatosBeneficiario {
  nombre: string;
  cuenta: string;
}

export interface ClienteForm {
  cuit: string;
}

export interface NuevaTransferenciaForm {
  fecha: moment.Moment;
  beneficiario: DatosBeneficiario;
  ordenante: DatosCliente;
  corresponsal: Banco;
  tipoComision: TipoComision;
  concepto: Concepto;
  importe: number;
  moneda: Moneda;
}

// Modelo back

// Response

// Request

export interface BeneficiarioRequest {}

export interface CuentaProducto {
  valor: string;
  codigo: string;
  descripcion: string;
  numero: number;
  moneda: number;
  monedaIso: string;
  saldo: number;
  sucursalAdministradora: number;
}
