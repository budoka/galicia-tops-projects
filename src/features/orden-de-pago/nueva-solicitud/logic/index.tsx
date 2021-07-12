import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { rejectRequest } from 'src/api/utils/axios';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { Cliente, Cuenta, Moneda } from 'src/features/_shared/data/interfaces';
import { fetchCuentas, fetchDatosClientes } from 'src/features/_shared/logic';
import { AddSolicitudPayload } from '../data/dto';
import { FormNames } from '../data/forms';
import { CuentaExterior, Gastos, NuevaSolicitudDataState, NuevaSolicitudState, Ordenante, StatusForms } from '../data/interfaces';

const FEATURE_NAME = 'ordenDePago/nuevaSolicitud';

//#region Async Actions

export const addSolicitud = createHttpAsyncThunk<NuevaSolicitudDataState, void, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/addSolicitud',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    if (!data) throw new Error('No se ha incluido datos para crear una nueva solicitud de orden de pago.');

    const requestData: AddSolicitudPayload = {
      uetr: data.form.uetr!,
      detalles: {
        FechaMensajeSolicitud: data.form.detalles?.fechaEntrada!,
        bancoBeneficiario: 'GABAARBA', // Banco Galicia
        bancoOrdenante: data.form.detalles?.ordenante.cuentaOrigen.swiftBanco!,
        bancoCorresponsal: data.form.detalles?.gastos.swiftCorresponsal!,
        cuentaBeneficiario: data.form.detalles?.cuentaDestino.numero.toString()!,
        cuentaOrdenante: data.form.detalles?.ordenante.cuentaOrigen.numero!,
        campo71A: data.form.detalles?.gastos.detalle.id!,
        moneda71G: data.form.detalles?.gastos.moneda.id!,
        codigoPais: data.form.detalles?.ordenante.pais.id!,
        cuitBeneficiario: data.form.detalles?.cliente?.cuit!,
        importe32A: data.form.detalles?.importe.toString()!,
        importe33B: (+data.form.detalles?.importe! + +data.form.detalles?.gastos.importe!).toString(),
        importe71G: data.form.detalles?.gastos.importe.toString()!,
        moneda: data.form.detalles?.moneda.id!,
        nombreBeneficiario: data.form.detalles!.cliente?.razonSocial || `${data.form.detalles!.cliente?.apellido}, ${data.form.detalles!.cliente?.nombre}`,
        nombreOrdenante: data.form.detalles!.ordenante?.razonSocial || `${data.form.detalles!.ordenante?.apellido}, ${data.form.detalles!.ordenante?.nombre}`,
      },
    };

    // Configuracion del servicio
    const api = apis['MENSAJE'];
    const resource = api.resources['AGREGAR_MENSAJE'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, body: requestData });

    console.log(config);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<void>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    console.log(responseData);

    return { status: response.status, data: responseData } as HttpResponse<void>;
  },
);

//#endregion

const initialState: NuevaSolicitudState = {
  info: {},
  data: {},
  ui: {
    form: {
      active: FormNames.DATOS_CLIENTE,
      status: { datosClientes: false, datosOrdenante: false, cuentas: false, importe: false, varios: false },
    },
  },
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setDatosCliente(state, action: PayloadAction<{ cliente: Cliente }>) {
      state.data.form = {
        ...state.data.form,
        detalles: {
          ...state.data.form?.detalles!,
          cliente: action.payload.cliente,
        },
      };
    },
    setDatosOrdenante(state, action: PayloadAction<Ordenante>) {
      state.data.form = { ...state.data.form, detalles: { ...state.data.form?.detalles!, ordenante: action.payload } };
    },
    setDatosCuentas(state, action: PayloadAction<{ cuentaOrigen: CuentaExterior; cuentaDestino: Cuenta }>) {
      state.data.form = {
        ...state.data.form,
        detalles: {
          ...state.data.form?.detalles!,
          cuentaDestino: action.payload.cuentaDestino,
          ordenante: {
            ...state.data.form?.detalles?.ordenante!,
            cuentaOrigen: action.payload.cuentaOrigen,
          },
        },
      };
    },
    setDatosImportes(state, action: PayloadAction<{ importe: number; moneda: Moneda }>) {
      state.data.form = {
        ...state.data.form,
        detalles: { ...state.data.form?.detalles!, importe: action.payload.importe, moneda: action.payload.moneda },
      };
    },
    setDatosVarios(state, action: PayloadAction<{ uetr: string; fechaEntrada: string; gastos: Gastos }>) {
      state.data.form = {
        ...state.data.form,
        uetr: action.payload.uetr,
        detalles: {
          ...state.data.form?.detalles!,
          fechaEntrada: action.payload.fechaEntrada,
          gastos: action.payload.gastos,
        },
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
    resetCliente(state) {
      state.info.clientes = { value: [], loading: false };
      state.data.form = {
        ...state.data.form,
        detalles: {
          ...state.data.form?.detalles!,
          cliente: undefined,
        },
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
      .addCase(addSolicitud.pending, (state) => {
        state.info.solicitudCreada = { value: false, loading: true };
      })
      .addCase(addSolicitud.fulfilled, (state) => {
        state.info.solicitudCreada = { value: true, loading: false };
      })
      .addCase(addSolicitud.rejected, (state, action) => {
        state.info.solicitudCreada = { value: false, loading: false, error: action.payload };
      });
  },
});

const {
  setDatosCliente,
  setDatosOrdenante,
  setDatosVarios,
  setDatosCuentas,
  setDatosImportes,
  setActiveForm,
  setEstadoForm,
  setForm,
  resetCliente,
  cleanState,
} = slice.actions;

export {
  setDatosCliente,
  setDatosOrdenante,
  setDatosVarios,
  setDatosCuentas,
  setDatosImportes,
  setActiveForm,
  setEstadoForm,
  setForm,
  resetCliente,
  cleanState,
};

export default slice.reducer;
