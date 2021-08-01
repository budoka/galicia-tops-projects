import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/api-list.config';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api.utils';
import { rejectRequest } from 'src/api/utils/axios.utils';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { GetMensajeDTO } from '../data/dto';
import { InfoMensajeState, Mensaje } from '../data/interfaces';

const FEATURE_NAME = 'infoMensaje';

//#region Async actions

export const fetchMensaje = createHttpAsyncThunk<void, Mensaje, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchMensaje',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['GATEWAY'];
    const resource = api.resources['DEVELOPERS_GET_ONE'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetMensajeDTO>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const mensajes = {
      canal: responseData.canal,
      fechaRecepcion: responseData.fechaRecepcion,
      id: responseData.id,
      mensaje: responseData.mensaje,
      codigo: responseData.mensajeCodigo,
      tipo: responseData.mensajeTipo,
      uetr: responseData.uetr,
      detalles: responseData.detalles,
      estados: responseData.estados.map((e) => ({
        id: e.id,
        idMT: e.idMT,
        idMTEstado: e.idMT_Estado,
        fechaEstado: e.fecha_Estado,
        descripcionEstado: e.descripcion_Estado,
      })),
    } as Mensaje;

    return { status: response.status, data: mensajes } as HttpResponse<Mensaje>;
  },
);

//#endregion

const initialState: InfoMensajeState = {
  info: {},
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    cleanState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMensaje.pending, (state) => {
        state.info.mensajes = { ...state.info.mensajes, loading: true };
      })
      .addCase(fetchMensaje.fulfilled, (state, action) => {
        state.info.mensajes = { value: { ...state.info.mensajes?.value, [`${action.payload?.data?.id}`]: action.payload?.data! }, loading: false };
      })
      .addCase(fetchMensaje.rejected, (state, action) => {
        state.info.mensajes = { ...state.info.mensajes, loading: false, error: action.payload };
      });
  },
});

const { cleanState } = slice.actions;

export { cleanState };

export default slice.reducer;
