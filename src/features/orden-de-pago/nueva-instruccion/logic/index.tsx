import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { rejectRequest } from 'src/api/utils/axios';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { Cliente, Cuenta, Moneda } from 'src/features/_shared/data/interfaces';
import { fetchCuentas, fetchDatosClientes } from 'src/features/_shared/logic';
import { AddInstruccionPayload, GetSolicitudDTO } from '../data/dto';
import { FormNames } from '../data/forms';
import { NuevaInstruccionDataState, NuevaInstruccionState, StatusForms, NuevaInstruccionFormState, Solicitud } from '../data/interfaces';

const FEATURE_NAME = 'ordenDePago/nuevaInstruccion';

//#region Async Actions

export const fetchDatosSolicitud = createHttpAsyncThunk<void, Solicitud, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchSolicitud',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['SOLICITUD'];
    const resource = api.resources['SOLICITUD'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetSolicitudDTO>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const solicitud: Solicitud = {
      id: responseData.id,
      cliente: {
        hostId: responseData.persona.perfilComercial.idPersona?.toString(),
        nombre: responseData.persona.nombre,
        apellido: responseData.persona.apellido,
        razonSocial: responseData.persona.razonSocial,
        cuit: responseData.persona.cuit,
      },
      cuenta: responseData.cuentaBeneficiario,
      importe: responseData.importe,
      moneda: { id: responseData.moneda.iso, descripcion: responseData.moneda.descripcion },
      numeroOperacion: responseData.nroOperacion,
    };

    return { status: response.status, data: solicitud } as HttpResponse<Solicitud>;
  },
);

export const addInstruccion = createHttpAsyncThunk<NuevaInstruccionDataState, void, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/addInstruccion',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    if (!data) throw new Error('No se ha incluido datos para crear una nueva instrucción de orden de pago.');

    const requestData: AddInstruccionPayload = {
      concepto: { id: data.form.concepto?.id!, codigo: data.form.concepto?.codigo!, descripcion: data.form.concepto?.descripcion! },
      monto: data.form.importe!,
      idSolicitud: data.form.solicitudId!,
      cuentaAcreditaCapital: {
        aliasMonedaCuenta: data.form.cuentaDestino?.monedaIso!,
        codigoMonedaCuenta: data.form.cuentaDestino?.moneda?.toString()!,
        isoMonedaCuenta: data.form.cuentaDestino?.monedaIso!,
        numeroDeCuenta: data.form.cuentaDestino?.numero?.toString()!,
        saldo: data.form.cuentaDestino?.saldo!,
        sucursal: data.form.cuentaDestino?.sucursalAdministradora?.toString()!,
        tipoDeCuenta: data.form.cuentaDestino?.codigo!,
        subsistemaCuenta: data.form.cuentaDestino?.codigoSubsistema,
      },
      cuentaDebitoComision: {
        aliasMonedaCuenta: data.form.cuentaComision?.monedaIso!,
        codigoMonedaCuenta: data.form.cuentaComision?.moneda?.toString()!,
        isoMonedaCuenta: data.form.cuentaComision?.monedaIso!,
        numeroDeCuenta: data.form.cuentaComision?.numero?.toString()!,
        saldo: data.form.cuentaComision?.saldo!,
        sucursal: data.form.cuentaComision?.sucursalAdministradora?.toString()!,
        tipoDeCuenta: data.form.cuentaComision?.codigo!,
        subsistemaCuenta: data.form.cuentaComision?.codigoSubsistema,
      },
    };

    // Configuracion del servicio
    const api = apis['SOLICITUD'];
    const resource = api.resources['INSTRUIR_SOLICITUD'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, body: requestData });

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<void>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    return { status: response.status, data: responseData } as HttpResponse<void>;
  },
);

//#endregion

const initialState: NuevaInstruccionState = {
  info: {},
  data: {},
  ui: {
    form: {
      active: FormNames.INSTRUCCION,
      status: { instruccion: false },
    },
  },
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setDatosInstruccion(state, action: PayloadAction<NuevaInstruccionFormState>) {
      state.data.form = {
        ...state.data.form,
        ...action.payload,
      };
    },
    setActiveForm(state, action: PayloadAction<string>) {
      state.ui.form.active = action.payload;
    },
    setEstadoForm(state, action: PayloadAction<StatusForms>) {
      state.ui.form.status = { ...state.ui.form.status, ...action.payload };
    },
    setForm(state, action: PayloadAction<{ active?: string; status?: StatusForms }>) {
      state.ui.form = { ...state.ui.form, ...action.payload };
    },
    resetSolicitud(state) {
      state.info.solicitud = { value: undefined, loading: false };
      state.data.form = {
        ...state.data.form,
        solicitudId: undefined,
      };
    },
    cleanState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatosClientes.pending, (state) => {
        state.info.clientes = { value: [], loading: true };
      })
      .addCase(fetchDatosClientes.fulfilled, (state, action) => {
        state.info.clientes = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchDatosClientes.rejected, (state, action) => {
        state.info.clientes = { value: [], loading: false, error: action.payload };
      });
    builder
      .addCase(fetchCuentas.pending, (state) => {
        state.info.cuentas = { value: [], loading: true };
      })
      .addCase(fetchCuentas.fulfilled, (state, action) => {
        state.info.cuentas = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchCuentas.rejected, (state, action) => {
        state.info.cuentas = { value: [], loading: false, error: action.payload };
      });
    builder
      .addCase(fetchDatosSolicitud.pending, (state) => {
        state.info.solicitud = { value: undefined, loading: true };
      })
      .addCase(fetchDatosSolicitud.fulfilled, (state, action) => {
        state.info.solicitud = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchDatosSolicitud.rejected, (state, action) => {
        state.info.solicitud = { value: undefined, loading: false, error: action.payload };
      });
    builder
      .addCase(addInstruccion.pending, (state) => {
        state.info.instruccionCreada = { value: false, loading: true };
      })
      .addCase(addInstruccion.fulfilled, (state) => {
        state.info.instruccionCreada = { value: true, loading: false };
      })
      .addCase(addInstruccion.rejected, (state, action) => {
        state.info.instruccionCreada = { value: false, loading: false, error: action.payload };
      });
  },
});

const { setDatosInstruccion, setActiveForm, setEstadoForm, setForm, resetSolicitud, cleanState } = slice.actions;

export { setDatosInstruccion, setActiveForm, setEstadoForm, setForm, resetSolicitud, cleanState };

export default slice.reducer;
