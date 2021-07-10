export interface AddSolicitudPayload {
  uetr: string;
  detalles: Detalles;
}

//#region Internal

interface Detalles {
  cuitBeneficiario: string;
  nombreBeneficiario: string;
  cuentaBeneficiario: string;
  bancoBeneficiario: string;
  FechaMensajeSolicitud: string;
  nombreOrdenante: string;
  cuentaOrdenante: string;
  moneda: string;
  moneda71G: string;
  // direccion: string;
  bancoOrdenante: string;
  bancoCorresponsal: string;
  campo71A: string;
  importe32A: string;
  importe33B: string;
  importe71G: string;
  codigoPais: string;
}

//#endregion
