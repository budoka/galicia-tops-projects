import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/api-list.config';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api.utils';
import { rejectRequest } from 'src/api/utils/axios.utils';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { Paginator } from 'src/features/_shared/data/interfaces';
import { GetMensajesDTO, GetMensajesPayload } from '../data/dto';
import { Filtros, ListaMensajesState, Mensaje } from '../data/interfaces';

const FEATURE_NAME = 'listaMensajes';

//#region Async actions

export const fetchMensajes = createHttpAsyncThunk<GetMensajesPayload, Mensaje[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchMensajes',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    // Configuracion del servicio
    const api = apis['GATEWAY'];
    const resource = api.resources['DEVELOPERS_GET_ONE'];
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
  data: {
    paginator: { pageSize: 20, current: 1 },
  },
  ui: {},
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setMensaje(state, action: PayloadAction<number>) {
      state.data.idMensaje = action.payload;
    },
    setFiltros(state, action: PayloadAction<Filtros>) {
      state.data.form = { ...state.data.form, filtros: action.payload };
    },
    resetFiltros(state) {
      state.data.form = { ...state.data.form, filtros: undefined };
    },
    setPaginator(state, action: PayloadAction<Paginator>) {
      state.data.paginator = { ...state.data.paginator, current: action.payload.current, pageSize: action.payload.pageSize };
    },
    setModalVisible(state, action: PayloadAction<boolean>) {
      state.ui.modal = action.payload;
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
        //  state.data.paginator = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchMensajes.rejected, (state, action) => {
        state.info.mensajes = { value: [], loading: false, error: action.payload };
      });
  },
});

const { setMensaje, setFiltros, resetFiltros, setPaginator, setModalVisible, cleanState } = slice.actions;

export { setMensaje, setFiltros, resetFiltros, setPaginator, setModalVisible, cleanState };

export default slice.reducer;
