import { Banco, Concepto, Cuenta, Moneda, Persona, InfoProductos, TipoComision } from 'src/features/shared/types';

export interface NuevaTransferenciaState {
  requiredData: Partial<RequiredData>;
  form: Partial<Form>;
  //loading: Loading;
  error: string | null;
  ui: UIState;
}

// Modelo front

export interface RequiredData {
  persona: Persona;
  cuenta: Cuenta;
  personas: { value: Persona[]; loading: boolean };
  infoProductos: { values: InfoProductos | null; loading: boolean };
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

export interface PersonaForm {
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

export interface GastoRequest {
  moneda: string;
  importe: number;
  detalle?: string;
}

export interface CuentaRequest {
  numero: string;
  sucursal: string;
  tipoCuenta: string;
  moneda: string;
}

export interface ComisionRequest {
  monedaComision: string;
  monedaCuenta: string;
  importeComision: number;
  importeCuenta: number;
  cotizacionComision: number;
  tipoComision: string;
  businessProcessCode?: string;
  transactionType?: string;
  estado: string;
  esBonificada: boolean;
}

export interface NuevaTransferenciaFormRequest {
  fechaAlta: string;
  codigoConcepto: string;
  // beneficiario: BeneficiarioTransferencia;
  // ordenante: OrdenanteTransferencia;
  // corresponsal: Banco;
  //  tipoComision: TipoComision;
  importe: number;
  monedaId: string;
  producto: string;
  gasto?: GastoRequest;
  cuentaDebitoComisiones?: CuentaRequest;
  cuentaDebitoTransferencia?: CuentaRequest;
  comision?: ComisionRequest;
}
