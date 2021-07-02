import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { rejectRequest } from 'src/api/utils/axios';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { GetMensajesDTO } from '../data/dto';
import { Filtros, ListaMensajesDataState, ListaMensajesState, Mensaje } from '../data/interfaces';

const FEATURE_NAME = 'listaMensajes';

//#region Async actions

export const fetchMensajes = createHttpAsyncThunk<ListaMensajesDataState, Mensaje[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchMensajes',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['GATEWAY'];
    const resource = api.resources['MENSAJES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetMensajesDTO[]>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const mensajes = responseData.map((m) => ({
      id: m.idMt,
      tipo: m.tipoMT,
      uetr: m.uetr,
      ordenante: m.clienteOrdenante,
      beneficiario: m.clienteBeneficiario,
      moneda: m.divisa,
      importe: m.importe,
      estado: m.estadoCompliance,
      fecha: m.fecha,
    })) as Mensaje[];

    return { status: response.status, data: mensajes } as HttpResponse<Mensaje[]>;
  },
);

//#endregion

const initialState: ListaMensajesState = {
  info: {},
  data: {},
  ui: {
    list: {
      status: { mensajes: false },
    },
  },
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setFiltros(state, action: PayloadAction<Filtros>) {
      state.data.form = { ...state.data.form, filtros: action.payload };
    },
    cleanState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMensajes.pending, (state) => {
        state.info.mensajes = { value: [], loading: true };
      })
      .addCase(fetchMensajes.fulfilled, (state, action) => {
        state.info.mensajes = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchMensajes.rejected, (state, action) => {
        state.info.mensajes = { value: [], loading: false, error: action.payload };
      });
  },
});

const { setFiltros, cleanState } = slice.actions;

export { setFiltros, cleanState };

export default slice.reducer;
