import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { RootState } from 'src/app/store';
import { Cliente } from 'src/features/shared/data/types';
import { fetchConceptos, fetchCorresponsales, fetchCuentas, fetchDatosClientes, fetchMonedas } from '../../shared/logic';
import { AddSolicitudDTO } from '../data/dto';
import { NuevaSolicitudDataState, NuevaSolicitudFormState, NuevaSolicitudState } from '../data/types';

const FEATURE_NAME = 'nuevaSolicitud';

//#region Async actions

export const addSolicitud = createAsyncThunk<void, RequestConfig<NuevaSolicitudDataState>, { state: RootState }>(
  FEATURE_NAME + '/addSolicitud',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.data;

    if (!data) throw new Error('No se ha incluido datos para crear una nueva solicitud transferencia.');

    console.log(data);

    const requestData: AddSolicitudDTO = {
      datosOperacion: {
        ...data.form.datosOperacion.fields!,
        monedaId: data.form.datosOperacion.fields?.moneda.id!,
        beneficiario: {
          ...data.form.datosOperacion.fields?.beneficiario!,
          paisId: data.form.datosOperacion.fields?.beneficiario.pais.id!,
          razonSocial:
            data.form.datosOperacion.fields?.beneficiario.razonSocial ??
            `${data.form.datosOperacion.fields?.beneficiario.nombre} ${data.form.datosOperacion.fields?.beneficiario.apellido}`,
          banco: {
            ...data.form.datosOperacion.fields?.beneficiario.banco!,
            nroCuenta: data.form.datosOperacion.fields?.beneficiario.banco.cuenta!,
            paisId: data.form.datosOperacion.fields?.beneficiario.banco.pais.id!,
          },
        },
        bancoIntermediario: {
          ...data.form.datosOperacion.fields?.bancoIntermediario!,
          nroCuenta: data.form.datosOperacion.fields?.bancoIntermediario.cuenta!,
          paisId: data.form.datosOperacion.fields?.bancoIntermediario.pais.id!,
        },
        cuentaDebito: {
          ...data.form.datosOperacion.fields?.cuentaDebito!,
          monedaId: data.form.datosOperacion.fields?.cuentaDebito.moneda.id!,
        },
        cuentaDebitoGasto: {
          ...data.form.datosOperacion.fields?.cuentaDebitoGasto!,
          monedaId: data.form.datosOperacion.fields?.cuentaDebitoGasto.moneda.id!,
        },
      },
    };

    // Configuracion del servicio
    const api = apis['TRANSFERENCIA'];
    const resource = api.resources['AGREGAR_SOLICITUD'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<void>(config);
    const responseData = response.data;

    console.log(responseData);
  },
);

//#endregion

const initialState: NuevaSolicitudState = {
  info: {},
  data: { extra: {}, form: { datosOperacion: {} } },
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    /*    setForm(state, action: PayloadAction<NuevaSolicitudFormState>) {
      state.data.form = action.payload;
    }, */
    setCliente(state, action: PayloadAction<Cliente>) {
      state.data.extra!.cliente = action.payload;
    },
    setClienteForm(state, action: PayloadAction<boolean>) {
      state.data.form!.datosOperacion.completed = action.payload;
    },
    /*     clearForm(state) {
      state.form = {};
      state.info.persona = undefined;
      //   state.info.infoProductos = undefined;
    }, */
    clearState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonedas.pending, (state) => {
        state.info.monedas = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchMonedas.fulfilled, (state, action) => {
        state.info.monedas = { value: action.payload, loading: false };
      })
      .addCase(fetchMonedas.rejected, (state, action) => {
        state.info.monedas = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchCorresponsales.pending, (state) => {
        state.info.corresponsales = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchCorresponsales.fulfilled, (state, action) => {
        state.info.corresponsales = { value: action.payload, loading: false };
      })
      .addCase(fetchCorresponsales.rejected, (state, action) => {
        state.info.corresponsales = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchConceptos.pending, (state) => {
        state.info.conceptos = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchConceptos.fulfilled, (state, action) => {
        state.info.conceptos = { value: action.payload, loading: false };
      })
      .addCase(fetchConceptos.rejected, (state, action) => {
        state.info.conceptos = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchDatosClientes.pending, (state) => {
        state.info.clientes = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchDatosClientes.fulfilled, (state, action) => {
        state.info.clientes = { value: action.payload, loading: false };
      })
      .addCase(fetchDatosClientes.rejected, (state, action) => {
        state.info.clientes = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchCuentas.pending, (state) => {
        state.info.cuentas = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchCuentas.fulfilled, (state, action) => {
        state.info.cuentas = { value: action.payload, loading: false };
      })
      .addCase(fetchCuentas.rejected, (state, action) => {
        state.info.cuentas = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    /*  builder
      .addCase(addSolicitud.pending, (state) => {
        state.form = { ...state.form, loading: true };
        state.error = null;
      })
      .addCase(addSolicitud.fulfilled, (state) => {
        state.form = { ...state.form, loading: false };
      })
      .addCase(addSolicitud.rejected, (state, action) => {
        state.form = { ...state.form, loading: false };
        state.error = action.error.message ?? null;
      }); */
  },
});

const { setCliente, setClienteForm, clearState } = slice.actions;

export { setCliente, setClienteForm, clearState };

export default slice.reducer;
