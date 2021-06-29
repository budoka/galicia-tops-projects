import { OpcionEx } from 'src/types';

export interface Keyable {
  id: string | number;
  [key: string]: any;
}

export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export interface MonedaOpt extends Omit<OpcionEx, 'value'> {
  value: string;
}

export interface PaisOpt extends Omit<OpcionEx, 'value'> {
  value: number;
}

export interface ConceptoOpt extends Omit<OpcionEx, 'value'> {
  value: string;
}

export interface TipoComision extends Omit<OpcionEx, 'value'> {
  value: string;
}

export interface BancoOpt extends Omit<OpcionEx, 'value'> {
  value: string;
  pais: PaisOpt;
}

export interface CuentaOpt extends Omit<OpcionEx, 'value'> {
  value: string;
}

export type TipoPersona = 'fisica' | 'juridica';
export type TipoCuenta = 'ca' | 'cc';
export type TipoCodigo = 'aba' | 'swift';
export type DetalleGasto = 'ben' | 'our' | 'sha';

export interface Cliente {
  hostId: string;
  tipo: TipoPersona;
  nombre?: string;
  apellido?: string;
  razonSocial?: string;
  documentos: Documento[];
  cuit?: string;
}

export interface Documento {
  tipo: string;
  descripcion: string;
  numero: string;
}

export interface CuentaProducto {
  // id: string;
  valor: string;
  codigo: string;
  descripcion: string;
  numero: number;
  moneda: number;
  monedaIso: string;
  saldo: number;
  sucursalAdministradora: number;
}
