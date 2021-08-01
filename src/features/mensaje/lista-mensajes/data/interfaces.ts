import { InfoState, Keyable, Paginator } from 'src/features/_shared/data/interfaces';
import { IElement } from 'src/types';

export interface ListaMensajesState {
  info: Partial<ListaMensajesInfoState>;
  data: Partial<ListaMensajesDataState>;
  ui: Partial<ListaMensajesUIState>;
}

export interface ListaMensajesInfoState {
  mensajes: InfoState<Mensaje[]>;
}

export interface ListaMensajesDataState {
  form: Partial<ListaMensajesFormState>;
  paginator: Paginator;
  idMensaje?: number;
}

export interface ListaMensajesUIState {
  // form: { status: StatusForms; active: string };
  // list: { status: StatusList };
  modal: boolean;
}

export interface ListaMensajesFormState {
  filtros: Filtros;
}

export interface Filtros {
  tipo: string;
  uetr: string;
  ordenante: string;
  beneficiario: string;
  moneda: string;
  importeMinimo: number;
  importeMaximo: number;
  estado: string;
  referencia: string;
  rangoFecha: string[];
}

export interface Mensaje extends IElement {
  id: number;
  tipo: string;
  uetr: string;
  ordenante: string;
  beneficiario: string;
  moneda: string;
  importe: string;
  estado: string;
  fecha: string;
}

export interface TipoMT extends Keyable {
  id: string;
  descripcion: string;
}
