import { BancoCorresponsal, Cliente, Concepto, Cuenta, InfoState, Keyable, Moneda, Pais } from 'src/features/_shared/data/interfaces';
import { DetalleGastos as DetalleGastoType, TipoCodigoBanco as TipoCodigoBancoType, TipoPersona as TipoPersonaType } from 'src/features/_shared/data/types';

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
  datosOperacion: DatosOperacion;
  normativas: Normativas;
}

export interface StatusForms {
  datosClientes?: boolean;
  datosBeneficiario?: boolean;
  cuentas?: boolean;
  importes?: boolean;
  varios?: boolean;
}

export interface DatosOperacion {
  fechaEntrada: string;
  cliente?: Cliente;
  beneficiario: Beneficiario;
  cuentaOrigen: Cuenta;
  cuentaComisiones?: Cuenta;
  gastos: Gastos;
  importes: Importe[];
  moneda: Moneda;
}

export interface Normativas {
  vinculadoConBeneficiario?: boolean;
}

export interface Beneficiario {
  tipoPersona: TipoPersona;
  razonSocial?: string;
  nombre?: string;
  apellido?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nif?: string;
  fechaNacimiento?: string;
  domicilio: Direccion;
  localidad: string;
  codigoPostal: string;
  pais: Pais;
  cuentaDestino?: CuentaExterior;
  cuentaIntermediario?: CuentaExterior;
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

export interface CuentaExterior {
  nombreBanco: string;
  localidadBanco: string;
  pais: Pais;
  moneda: Moneda;
  numero: string;
  tipoCodigoBanco?: string | TipoCodigoBanco;
  codigoBanco?: string;
  tipoCodigoBancoAdicional?: string;
  codigoBancoAdicional?: string;
}

export interface Gastos {
  detalle: DetalleGastos;
  /*   importe?: number;
  moneda?: Moneda;
  swiftCorresponsal?: string;
  cuentaCorresponsal?: string; */
}

export interface DetalleGastos {
  id: string;
  descripcion: DetalleGastoType;
}

export interface Importe {
  importe: number;
  concepto: Concepto;
}

export interface TipoCodigoBanco {
  id: TipoCodigoBancoType;
  descripcion: string;
}
