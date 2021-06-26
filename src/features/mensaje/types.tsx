export interface MensajeState {
  requiredData: Partial<RequiredData>;
  form: Partial<Form>;
  error: string | null;
  ui: UIState;
}

// Modelo front

export interface RequiredData {
  /* personas: { value: Persona[]; loading: boolean };
  infoProductos: { values: InfoProductos | null; loading: boolean };
  conceptos: { values: Concepto[]; loading: boolean };
  corresponsales: { values: Banco[]; loading: boolean };
  tiposComisiones: { values: TipoComision[]; loading: boolean };
  monedas: { values: Moneda[]; loading: boolean };*/
}

export interface Form {
  data: Partial<BusquedaMensajesForm>;
  loading: boolean;
}

export interface BusquedaMensajesForm {
  fechaDesde: moment.Moment;
  fechaHasta: moment.Moment;
  ordenante: string;
  beneficiario: string;
  importeDesde: number;
  importeHasta: number;
  uetr: string;
  mt: string;
  // paginador: Paginator;
}

export interface UIState {}

// Modelo back

// Response

export interface BusquedaMensajesFormResponse {
  fechaInicial: string;
  fechaFinal: string;
  ordenante: string;
  beneficiario: string;
  importeDesde: string;
  importeHasta: string;
  uetr: string;
  tipoMT: string;
  pageSize: number;
}

export interface BusquedaMensajesFormResponse {
  fechaInicial: string;
  fechaFinal: string;
  ordenante: string;
  beneficiario: string;
  importeDesde: string;
  importeHasta: string;
  uetr: string;
  tipoMT: string;
  pageSize: number;
}

// Request

export interface BusquedaMensajesRequest {
  fechaInicial: string;
  fechaFinal: string;
  ordenante: string;
  beneficiario: string;
  importeDesde: string;
  importeHasta: string;
  uetr: string;
  tipoMT: string;
  pageSize: number;
}
