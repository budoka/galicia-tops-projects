import { Cliente, Concepto, Cuenta, InfoState, Moneda } from 'src/features/_shared/data/interfaces';

export interface NuevaInstruccionState {
  info: Partial<NuevaInstruccionInfoState>;
  data: Partial<NuevaInstruccionDataState>;
  ui: NuevaInstruccionUIState;
}

export interface NuevaInstruccionInfoState {
  clientes: InfoState<Cliente[]>;
  cuentas: InfoState<Cuenta[]>;
  solicitud: InfoState<Solicitud>;
  instruccionCreada: InfoState<boolean>;
}

export interface NuevaInstruccionDataState {
  form: Partial<NuevaInstruccionFormState>;
}

export interface NuevaInstruccionUIState {
  form: { status: StatusForms; active: string };
}

export interface NuevaInstruccionFormState {
  solicitudId: number;
  cuentaDestino: Cuenta;
  cuentaComision: Cuenta;
  concepto: Concepto;
  importe: number;
}

export interface StatusForms {
  solicitud?: boolean;
  instruccion?: boolean;
}

export interface Solicitud {
  id: number;
  importe: number;
  moneda: Moneda;
  cliente: ClienteSolicitud;
  numeroOperacion: string;
  cuenta: string;
}

export interface ClienteSolicitud extends Pick<Cliente, 'hostId' | 'cuit' | 'nombre' | 'apellido' | 'razonSocial'> {}
