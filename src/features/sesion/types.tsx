export interface SesionSliceState {
  data: InfoSesion;
  loading: boolean;
  error: string | null;
}

// Modelo front

export interface InfoSesion {
  idUsuario?: number;
  nombreUsuario?: string;
  legajo?: string;
}

export type InfoAzure = Pick<InfoSesion, 'legajo' | 'nombreUsuario'>;
