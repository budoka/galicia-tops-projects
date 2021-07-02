import { InfoState, Keyable } from 'src/features/_shared/data/interfaces';
import { IElement } from 'src/types/interfaces';

export interface ListaMensajesState {
  info: Partial<ListaMensajesInfoState>;
  data: Partial<ListaMensajesDataState>;
  ui: ListaMensajesUIState;
}

export interface ListaMensajesInfoState {
  mensajes: InfoState<Mensaje[]>;
}

export interface ListaMensajesDataState {
  form: Partial<ListaMensajesFormState>;
}

export interface ListaMensajesUIState {
  // form: { status: StatusForms; active: string };
  list: { status: StatusList };
}

export interface ListaMensajesFormState {
  filtros: Filtros;
}

export interface StatusList {
  mensajes: boolean;
}

export interface Filtros {
  tipo: string;
  uetr: string;
  ordenante: string;
  beneficiario: string;
  moneda: string;
  rangoImporte: number[];
  estado: string;
  rangoFecha: string[];
}

export interface Mensaje extends IElement {
  id: string;
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
