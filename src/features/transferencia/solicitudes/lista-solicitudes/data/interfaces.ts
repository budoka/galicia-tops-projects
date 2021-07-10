import { InfoState, Keyable, Paginator } from 'src/features/_shared/data/interfaces';
import { IElement } from 'src/types/interfaces';

export interface ListaSolicitudesState {
  info: Partial<ListaSolicitudesInfoState>;
  data: Partial<ListaSolicitudesDataState>;
  ui: Partial<ListaSolicitudesUIState>;
}

export interface ListaSolicitudesInfoState {
  solicitudes: InfoState<Solicitud[]>;
}

export interface ListaSolicitudesDataState {
  form: Partial<ListaSolicitudesFormState>;
  paginator: Paginator;
  idMensaje?: number;
}

export interface ListaSolicitudesUIState {
  // form: { status: StatusForms; active: string };
  // list: { status: StatusList };
  modal: boolean;
}

export interface ListaSolicitudesFormState {
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

export interface Solicitud extends IElement {
  id: number;
}

export interface TipoMT extends Keyable {
  id: string;
  descripcion: string;
}
