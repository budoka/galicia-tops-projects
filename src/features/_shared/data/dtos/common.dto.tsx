export interface GetClienteDTO {
  hostId: string;
  tipo: TipoPersona;
  nombre?: string;
  apellido?: string;
  razonSocial?: string;
  documentos: Documento[];
}

export interface GetConceptoDTO {
  codigo: string;
  descripcion: string;
  grupoConceptoCodigo: string;
}

export interface GetConceptoSecopaDTO {
  id: number;
  codigo: string;
  descripcion: string;
}

export interface GetCorresponsalDTO {
  codigo: string;
  moneda: GetMonedaDTO;
  nombre: string;
  localidad: string;
  cuenta: string;
  codigoSwift: string;
  rubroContable: string;
  codigoABA: string;
  comex: boolean;
  pais: GetPaisDTO;
}

export interface GetCuentaDTO {
  valor: string;
  codigo: string;
  descripcion: string;
  numero: number;
  moneda: number;
  monedaIso: string;
  saldo: number;
  sucursalAdministradora: number;
  codigoSubsistema: string;
}

export interface GetInfoProductosDTO {
  cantidadProductos: number;
  empleado: boolean;
  posicionPropia: boolean;
  productos: Productos;
}

export interface GetMonedaDTO {
  iso: string;
  descripcion: string;
  nroSwift: number;
  stock: number;
  calypso: number;
  calypsoUSD: number;
  sml: boolean;
}

export interface GetPaisDTO {
  codigo: string;
  codigo_BCRA: string;
  swift_alfabetico: string;
  descripcion: string;
  descripcionIngles: string;
  id: number;
}

interface Productos {
  cuentas: GetCuentaDTO[];
}

interface Documento {
  tipo: string;
  descripcion: string;
  id: string;
}

type TipoPersona = 'FISICA' | 'JURIDICA';
