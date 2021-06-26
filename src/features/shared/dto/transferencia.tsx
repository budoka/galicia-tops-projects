export interface AddGastoDTO {
  moneda: string;
  importe: number;
  detalle?: string;
}

export interface AddCuentaDTO {
  numero: string;
  sucursal: string;
  tipoCuenta: string;
  moneda: string;
}

export interface AddComisionDTO {
  monedaComision: string;
  monedaCuenta: string;
  importeComision: number;
  importeCuenta: number;
  cotizacionComision: number;
  tipoComision: string;
  businessProcessCode?: string;
  transactionType?: string;
  estado: string;
  esBonificada: boolean;
}

export interface AddTransferenciaDTO {
  fechaAlta: string;
  codigoConcepto: string;
  // beneficiario: BeneficiarioTransferencia;
  // ordenante: OrdenanteTransferencia;
  // corresponsal: Banco;
  //  tipoComision: TipoComision;
  importe: number;
  monedaId: string;
  producto: string;
  gasto?: AddGastoDTO;
  cuentaDebitoComisiones?: AddCuentaDTO;
  cuentaDebitoTransferencia?: AddCuentaDTO;
  comision?: AddComisionDTO;
}
