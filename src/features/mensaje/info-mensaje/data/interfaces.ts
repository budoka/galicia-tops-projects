import { InfoState } from 'src/features/_shared/data/interfaces';

export interface ListaMensajeState {
  info: Partial<ListaMensajeInfoState>;
  ui: Partial<ListaMensajeUIState>;
}

export interface ListaMensajeInfoState {
  mensaje: InfoState<Mensaje>;
}

export interface ListaMensajeUIState {
  // form: { status: StatusForms; active: string };
  // list: { status: StatusList };
}

export interface Mensaje {
  id: number;
  canal: string;
  fechaRecepcion: string;
  mensaje: string;
  codigo: string;
  tipo: string;
  uetr: string;
  detalles: DetalleMensaje[];
  estados: EstadoMensaje[];
}

export interface DetalleMensaje {
  id: number;
  idMT: number;
  nombre: string;
  valor: string;
}

export interface EstadoMensaje {
  id: number;
  idMT: number;
  idMTEstado: number;
  descripcionEstado: string;
  fechaEstado: string;
}
