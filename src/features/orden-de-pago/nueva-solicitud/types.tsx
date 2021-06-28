import { BancoOpt, ConceptoOpt, MonedaOpt, Cliente, TipoComision } from 'src/features/shared/data/types';
import { Opcion, OpcionEx } from 'src/types';

export interface NuevaSolicitudState {
  requiredData: Partial<RequiredData>;
  form: Partial<Form>;
  //loading: Loading;
  error: string | null;
  ui: UIState;
}

// Modelo front

export interface RequiredData {
  persona: { value: Cliente; loading: boolean };
  personas: { value: Cliente[]; loading: boolean };
  conceptos: { values: ConceptoOpt[]; loading: boolean };
  corresponsales: { values: BancoOpt[]; loading: boolean };
  tiposComisiones: { values: TipoComision[]; loading: boolean };
  monedas: { values: MonedaOpt[]; loading: boolean };
}

export interface Form {
  data: Partial<SolicitudForm>;
  loading: boolean;
}

export interface OrdenanteTransferencia {
  nombre: string;
  cuenta: string;
}

export interface BeneficiarioTransferencia {
  cuit: string;
  cuenta: string;
  banco: string; //Banco;
}

export interface PersonaForm {
  cuit: string;
}

export interface SolicitudForm {
  fecha: moment.Moment;
  beneficiario: BeneficiarioTransferencia;
  ordenante: OrdenanteTransferencia;
  corresponsal: BancoOpt;
  tipoComision: TipoComision;
  concepto: ConceptoOpt;
  importe: number;
  moneda: MonedaOpt;
}

export interface UIState {}

// Modelo back

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
  gasto?: GastoRequest;
  cuentaDebitoComisiones?: CuentaRequest;
  cuentaDebitoTransferencia?: CuentaRequest;
  comision?: ComisionRequest;
}
