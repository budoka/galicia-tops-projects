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

export type TipoPersona = 'fisica' | 'juridica';

export interface Cliente {
  hostId: string;
  tipo: TipoPersona;
  nombre?: string;
  apellido?: string;
  razonSocial?: string;
  documentos: Documento[];
}

export interface Documento {
  tipo: string;
  descripcion: string;
  valor: string;
}

export interface PersonaForm {
  cuit: string;
}
