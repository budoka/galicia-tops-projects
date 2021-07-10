import { DetalleGasto, TipoCodigoBanco, TipoCuenta, TipoPersona } from 'src/features/_shared/data/types';

export interface AddSolicitudPayload {
  datosOperacion: DatosOperacion;
  normativas: Normativas;
}

//#region Internal

interface DatosOperacion {
  fechaEntrada: string;
  tipoDocumentoCliente: string;
  documentoCliente: string;
  beneficiario: Beneficiario;
  cuentaDebito: Cuenta;
  cuentaDebitoGastos?: Cuenta;
  gasto: Gasto;
  monedaId: string;
  importes: Importe[];
}

interface Normativas {
  vinculadoConBeneficiario: boolean;
}

interface Beneficiario {
  identificacionPersona: string;
  tipoDeDocumento?: string;
  numeroDeDocumento?: string;
  nif?: string;
  tipoPersona: TipoPersona;
  fechaNacimiento?: string;
  domicilio: Direccion;
  localidad: string;
  codigoPostal: string;
  isoAlfanumericoPais: string;
  cuentaBancoDestino: CuentaExterior;
  cuentaBancoIntermediario?: CuentaExterior;
}

interface Direccion {
  calle: string;
  numero: number;
  piso?: number;
  departamento?: string;
}

interface CuentaExterior {
  nombre: string;
  localidad: string;
  isoAlfanumericoPais: string;
  nroCuenta: string;
  tipoCodigoDelBanco?: TipoCodigoBanco;
  codigoBanco?: string;
  tipoDeCodigoAdicional?: string;
  codigoDelBancoAdicional?: string;
}

interface Cuenta {
  tipoDeCuenta: TipoCuenta;
  isoMonedaCuenta: string;
  numeroDeCuenta: string;
  sucursal: string;
}

interface Gasto {
  detalle: DetalleGasto;
  importe?: number;
  monedaId?: string;
  swiftCorresponsal?: string;
  cuentaCorresponsal?: string;
}

interface Importe {
  importe: number;
  concepto: Concepto;
}

interface Concepto {
  id: string;
  codigo: string;
}

//#endregion
