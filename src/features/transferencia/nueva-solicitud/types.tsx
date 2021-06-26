import { Banco, Concepto, Cuenta, Moneda, Cliente, TipoComision } from 'src/features/shared/types';

export interface NuevaTransferenciaState {
  requiredData: Partial<RequiredData>;
  form: Partial<Form>;
  //loading: Loading;
  error: string | null;
  ui: UIState;
}

// Modelo front

export interface RequiredData {
  persona: Cliente;
  cuenta: Cuenta;
  personas: { value: Cliente[]; loading: boolean };
  cuentas: { values: CuentaProducto[]; loading: boolean };
  conceptos: { values: Concepto[]; loading: boolean };
  corresponsales: { values: Banco[]; loading: boolean };
  tiposComisiones: { values: TipoComision[]; loading: boolean };
  monedas: { values: Moneda[]; loading: boolean };
}

export interface Form {
  data: Partial<NuevaTransferenciaForm>;
  loading: boolean;
}

export interface BeneficiarioTransferencia {
  nombre: string;
  cuenta: string;
}

export interface OrdenanteTransferencia {
  cuit: string;
  cuenta: string;
  banco: string; //Banco;
}

export interface ClienteForm {
  cuit: string;
}

export interface NuevaTransferenciaForm {
  fecha: moment.Moment;
  beneficiario: BeneficiarioTransferencia;
  ordenante: OrdenanteTransferencia;
  corresponsal: Banco;
  tipoComision: TipoComision;
  concepto: Concepto;
  importe: number;
  moneda: Moneda;
}

/* export interface Loading {
  monedas: boolean;
  monedas: boolean;
  monedas: boolean;
}
 */
export interface UIState {}

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
