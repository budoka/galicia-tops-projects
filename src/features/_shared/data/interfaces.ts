import { TipoPersona } from './types';

export interface InfoState<T> {
  value?: T;
  loading: boolean;
  error?: unknown;
}

//#region State

export interface SharedState {
  conceptos?: InfoState<Concepto[]>;
  corresponsales?: InfoState<BancoCorresponsal[]>;
  monedas?: InfoState<Moneda[]>;
  paises?: InfoState<Pais[]>;
}

//#endregion

//#region Select

/**
 * Cada opción del select debe tener una propiedad 'id',
 * la idea de esta propiedad es permitir mapear las propiedades 'key' y 'value'
 * de cada opción del select (LabeledValue).
 */
export interface Keyable {
  id: string | number;
  [key: string]: any;
}

export interface Paginator {
  pageSize?: number;
  current?: number;
  total?: number;
}

//#endregion

export interface BancoCorresponsal extends Keyable {
  id: string;
  nombre: string;
}

export interface Cliente {
  hostId: string;
  tipo: TipoPersona;
  nombre?: string;
  apellido?: string;
  razonSocial?: string;
  documentos: Documento[];
  cuit?: string;
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
  codigoSubsistema: string;
}

export interface Concepto extends Keyable {
  id: string; // TODO: el id actualmente es el codigo (ej: A07, A08), si se cambia a number se deberia mover el valor a la propiedad codigo
  descripcion: string;
}

export interface Documento {
  tipo: string;
  descripcion: string;
  numero: string;
}

export interface Moneda extends Keyable {
  id: string;
  descripcion: string;
}

export interface Pais extends Keyable {
  id: string;
  nombre: string;
}
