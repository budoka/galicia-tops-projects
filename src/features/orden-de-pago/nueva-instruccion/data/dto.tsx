import { GetMonedaDTO } from 'src/features/_shared/data/dtos/common.dto';

export interface GetSolicitudDTO {
  id: number;
  importe: number;
  moneda: GetMonedaDTO;
  nroOperacion: string;
  cuentaBeneficiario: string;
  persona: Persona;
}

export interface AddInstruccionPayload {
  idSolicitud: number;
  cuentaAcreditaCapital: Cuenta;
  cuentaDebitoComision: Cuenta;
  concepto: Concepto;
  monto: number;
}

//#region Internal

interface Persona {
  nombre: string;
  apellido: string;
  razonSocial: string;
  cuit: string;
  perfilComercial: PerfilComercial;
}

interface PerfilComercial {
  idPersona: number;
}

interface Cuenta {
  subsistemaCuenta?: string;
  codigoMonedaCuenta: string;
  numeroDeCuenta: string;
  tipoDeCuenta: string;
  puedePreparar?: boolean;
  puedeAutorizar?: boolean;
  saldo: number;
  aliasMonedaCuenta: string;
  isoMonedaCuenta: string;
  sucursal: string;
}

interface Concepto {
  id: number;
  codigo: string;
  descripcion: string;
  descripcionDeNegocio?: string;
}

//#endregion
