export interface GetMensajesDTO {
  clienteBeneficiario: string;
  clienteOrdenante: string;
  divisa: string;
  estadoCompliance: string;
  fecha: string;
  idMt: number;
  importe: string;
  tipoMT: string;
  uetr: string;
}

export interface GetMensajesPayload {
  beneficiario?: string;
  ordenante?: string;
  fechaInicial?: string;
  fechaFinal?: string;
  importeDesde?: number;
  importeHasta?: number;
  tipoMT?: string;
  uetr?: string;
  divisa?: string;
  referencia?: string;
  pageSize: number;
}
