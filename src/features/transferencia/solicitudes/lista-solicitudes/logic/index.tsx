import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { rejectRequest } from 'src/api/utils/axios';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { Paginator } from 'src/features/_shared/data/interfaces';
import { sleep } from 'src/utils/common';
import { GetSolicitudesDTO, GetSolicitudesPayload } from '../data/dto';
import { Filtros, ListaSolicitudesState, Solicitud } from '../data/interfaces';

const FEATURE_NAME = 'listaMensajes';

//#region Async actions

export const fetchSolicitudes = createHttpAsyncThunk<GetSolicitudesPayload, Solicitud[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchSolicitudes',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    // Configuracion del servicio
    const api = apis['MENSAJE'];
    const resource = api.resources['MENSAJES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetSolicitudesDTO[]>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const mensajes = responseData.map((m) => ({})) as Solicitud[];

    return { status: response.status, data: mensajes } as HttpResponse<Solicitud[]>;
  },
);

//#endregion

const initialState: ListaSolicitudesState = {
  info: {},
  data: {
    paginator: { pageSize: 10, current: 1 },
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
      .addCase(fetchSolicitudes.pending, (state) => {
        state.info.solicitudes = { value: [], loading: true };
      })
      .addCase(fetchSolicitudes.fulfilled, (state, action) => {
        state.info.solicitudes = { value: action.payload?.data, loading: false };
        //  state.data.paginator = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchSolicitudes.rejected, (state, action) => {
        state.info.solicitudes = { value: [], loading: false, error: action.payload };
      });
  },
});

const { setMensaje, setFiltros, resetFiltros, setPaginator, setModalVisible, cleanState } = slice.actions;

export { setMensaje, setFiltros, resetFiltros, setPaginator, setModalVisible, cleanState };

export default slice.reducer;
