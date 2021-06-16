import { OpcionEx } from 'src/types';

export interface Moneda extends Omit<OpcionEx, 'value'> {
  value: string;
}

export interface Pais extends Omit<OpcionEx, 'value'> {
  value: number;
}

export interface Concepto extends Omit<OpcionEx, 'value'> {
  value: string;
}

export interface TipoComision extends Omit<OpcionEx, 'value'> {
  value: string;
}

export interface Banco extends Omit<OpcionEx, 'value'> {
  value: string;
  pais: Pais;
}

export interface Cuenta extends Omit<OpcionEx, 'value'> {
  value: string;
}

export interface Documento {
  tipo: string;
  descripcion: string;
  id: string;
}

export interface Persona {
  nombre: string;
  apellido: string;
  razonSocial: string;
  idHost: string;
  tipo: string;
  documentos: Documento[];
}

export interface Importe {
  monto: number;
  moneda: Moneda;
}

export interface InfoProductos {
  cantidadProductos: number;
  empleado: boolean;
  posicionPropia: boolean;
  productos: Productos;
}

export interface Productos {
  cuentas: Cuenta[];
}

export interface Cuenta {
  codigo: string;
  descripcion: string;
  numero: number;
  moneda: {
    iso: string;
    descripcion: string;
    nroSwift: number;
    stock: number;
    sap: number;
    calypso: number;
  };
  saldo: number;
  sucursalAdministradora: number;
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

export interface Paginator {
  currentPage: number;
  pageSize: number;
}

export interface UIState {}

// Modelo back

// Response

export interface MonedaResponse {
  iso: string;
  descripcion: string;
  nroSwift: string;
  afip: string;
  bcra: string;
  stock: string;
  sap: string;
  calypso: string;
  calypsoUSD: string;
}

export interface PaisResponse {
  codigo: string;
  codigo_BCRA: string;
  swift_alfabetico: string;
  descripcion: string;
  descripcionIngles: string;
  id: number;
}

export interface BancoResponse {
  codigo: string;
  moneda: MonedaResponse;
  nombre: string;
  localidad: string;
  cuenta: string;
  codigoSwift: string;
  rubroContable: string;
  codigoABA: string;
  comex: boolean;
  pais: PaisResponse;
}

export interface ConceptoResponse {
  codigo: string;
  descripcion: string;
  grupoConceptoCodigo: string;
}

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
