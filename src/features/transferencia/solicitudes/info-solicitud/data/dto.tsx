export interface GetMensajeDTO {
  id: number;
  canal: string;
  fechaRecepcion: string;
  mensaje: string;
  mensajeCodigo: string;
  mensajeTipo: string;
  uetr: string;
  detalles: DetalleMensaje[];
  estados: EstadoMensaje[];
}

interface DetalleMensaje {
  id: number;
  idMT: number;
  nombre: string;
  valor: string;
  descripcion: string;
}

interface EstadoMensaje {
  id: number;
  idMT: number;
  idMT_Estado: number;
  descripcion_Estado: string;
  fecha_Estado: string;
}
