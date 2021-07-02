import { DetalleGasto, TipoCodigo, TipoCuenta, TipoPersona } from 'src/features/_shared/data/types';

export interface AddSolicitudDTO {
  datosOperacion: DatosOperacion;
}

//#region Internal

interface DatosOperacion {
  fechaEntrada: string;
  cuitCliente: string;
  beneficiario: Beneficiario;
  bancoIntermediario?: Banco;
  cuentaDebito: Cuenta;
  cuentaDebitoGastos?: Cuenta;
  gasto: Gasto;
  importes: Importe[];
  monedaId: string;
  vinculadoConBeneficiario: boolean;
}

interface Beneficiario {
  razonSocial: string;
  nif?: string;
  tipoPersona: TipoPersona;
  fechaNacimiento?: string;
  domicilio: Direccion;
  localidad: string;
  codigoPostal: string;
  paisId: number;
  banco: Banco;
}

interface Direccion {
  calle: string;
  numero: number;
  piso?: number;
  departamento?: string;
}

interface Banco {
  nombre: string;
  localidad: string;
  paisId: number;
  nroCuenta: string;
  tipoCodigo?: TipoCodigo;
  codigo?: string;
  codigoBanco?: string;
}

interface Cuenta {
  tipoCuenta: TipoCuenta;
  monedaId: string;
  numero: string;
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
  descripcion: string;
}

//#endregion
