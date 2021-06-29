import { DetalleGasto, TipoCodigo, TipoCuenta, TipoPersona } from 'src/features/shared/data/types';

export interface AddSolicitudDTO {
  datosOperacion: DatosOperacionDTO;
}

export interface DatosOperacionDTO {
  fechaEntrada: string;
  cuitCliente: string;
  beneficiario: BeneficiarioDTO;
  bancoIntermediario?: BancoDTO;
  cuentaDebito: CuentaDTO;
  cuentaDebitoGastos?: CuentaDTO;
  gasto: GastoDTO;
  importes: ImporteDTO[];
  monedaId: string;
  vinculadoConBeneficiario: boolean;
}

export interface BeneficiarioDTO {
  razonSocial: string;
  nif?: string;
  tipoPersona: TipoPersona;
  fechaNacimiento?: string;
  domicilio: DireccionDTO;
  localidad: string;
  codigoPostal: string;
  paisId: number;
  banco: BancoDTO;
}

export interface DireccionDTO {
  calle: string;
  numero: number;
  piso?: number;
  departamento?: string;
}

export interface BancoDTO {
  nombre: string;
  localidad: string;
  paisId: number;
  nroCuenta: string;
  tipoCodigo?: TipoCodigo;
  codigo?: string;
  codigoBanco?: string;
}

export interface CuentaDTO {
  tipoCuenta: TipoCuenta;
  monedaId: string;
  numero: string;
}

export interface GastoDTO {
  detalle: DetalleGasto;
  importe?: number;
  monedaId?: string;
  swiftCorresponsal?: string;
  cuentaCorresponsal?: string; // TODO: Por alguna razon se saco del dto del back. Revisar.
}

export interface ImporteDTO {
  importe: number;
  concepto: ConceptoDTO;
}

export interface ConceptoDTO {
  id: string;
  descripcion: string;
}
