import { InfoState } from 'src/features/_shared/data/interfaces';
import { Dictionary } from 'src/types';

export interface InfoMensajeState {
  info: Partial<InfoMensajeInfoState>;
  // ui: Partial<InfoMensajeUIState>;
}

export interface InfoMensajeInfoState {
  mensajes: InfoState<Dictionary<Mensaje>>;
}

export interface InfoMensajeUIState {
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
