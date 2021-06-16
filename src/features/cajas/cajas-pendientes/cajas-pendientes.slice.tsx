import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants';
import { RootState } from 'src/reducers';
import { splitStringByWords } from 'src/utils/string';
import {
  CajasPendientes,
  CajasPendientesRequestBody,
  CajasPendientesResponseBody,
  CajasPendientesSliceState,
  CantidadCajas,
  CantidadCajasRequestBody,
  DetalleCaja,
  FiltrosCajas,
} from './types';

const FEATURE_NAME = 'cajasPendientes';

// Async actions

/* const fetchCantidadCajasDashboard = createAsyncThunk<number, void, { state: RootState }>(
  FEATURE_NAME + '/fetchCantidadCajasDashboard',
  async (_, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Mapeo de la solicitud
    const requestData: CantidadCajasRequestBody[] = [
      {
        idEstado: 'PendienteCierre',
        idEstadoFiltro: 'Igual',
      },
      {
        idEstado: 'PendienteRecepcion',
        idEstadoFiltro: 'Igual',
      }
    ]

    // Configuracion del servicio
    const api = apis['CAJA'];
    const resource = api.resources['CANTIDAD_CAJAS'];
    const config1 = buildAxiosRequestConfig(api, resource, requestData[0]);
    const config2 = buildAxiosRequestConfig(api, resource, requestData[1]);

    // Respuesta del servicio
    const response = await axios.request<number>(config1);
    const responseData = response.data;

    // Mapeo de la respuesta
    const cantidadCajas = responseData;

    return cantidadCajas;
  },
);
 */

/*
const fetchCantidadCajas = createAsyncThunk<
  CantidadCajas | number,
  RequestConfig<{ filters: FiltrosCajas; key?: keyof CantidadCajas }>, // Cambiar FiltrosCajas por CantidadCajasRequestBody
  { state: RootState }
>(FEATURE_NAME + '/fetchCantidadCajas', async (options, thunkApi) => {
  const { dispatch, getState } = thunkApi;
  const data = options.data!;

  const filters: FiltrosCajas = getState().cajas.pendientes.filters;

  // Mapeo de la solicitud
  const requestData: CantidadCajasRequestBody = {
    idEstado: data.filters.estado,
    idEstadoFiltro: 'Igual',
  };

  // Configuracion del servicio
  const api = apis['CAJA'];
  const resource = api.resources['CANTIDAD_CAJAS'];
  const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

  // Respuesta del servicio
  const response = await axios.request<number>(config);
  const responseData = response.data;

  // Mapeo de la respuesta
  const cantidadCajas: CantidadCajas | number = data.key ? Object.assign({}, { [data.key]: responseData }) : responseData;

  return cantidadCajas;
});

const fetchCajas = createAsyncThunk<CajasPendientes, RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchCajas',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    const filters: FiltrosCajas = getState().cajas.pendientes.filters;

    // Mapeo de la solicitud
    const requestData: CajasPendientesRequestBody = {
      idUsuario: getState().sesion.data?.idUsuario!,
      roles: [getState().sesion.data?.perfil!],
      estado: filters.estado,
      fechaDesde: filters.fecha && filters.fecha.length > 0 ? filters.fecha[0].format() : undefined,
      fechaHasta: filters.fecha && filters.fecha.length > 1 ? moment(filters.fecha[1]).add(1, 'day').format() : undefined, // workaround  moment(...).add(1, 'day')
      centroCosto: filters.sector,
      nombre: filters.usuario,
    };

    // Configuracion del servicio
    const api = apis['CAJA'];
    const resource = api.resources['DETALLE_CAJA'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

    // Respuesta del servicio
    const response = await axios.request<CajasPendientesResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const cajas = responseData.map((caja) => {
      return {
        numero: caja.numero,
        descripcion: caja.descripcion,
        estado: splitStringByWords(caja.estado)?.join(' '),
        fechaEmision: moment(caja.fechaEmision).format(DATE_DD_MM_YYYY_FORMAT),
        sector: caja.sector,
        usuario: caja.usuario,
      } as DetalleCaja;
    });

    return cajas;
  },
);

const exportCajas = createAsyncThunk<void, void, { state: RootState }>(FEATURE_NAME + '/exportCajas', async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi;
});

// Slice

const initialState: CajasPendientesSliceState = {
  data: { cajas: [] },
  filters: {},
  loading: {},
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FiltrosCajas>) {
      state.filters = action.payload;
    },
    clearFilters(state) {
      state.filters = {};
    },
    clearState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCantidadCajas.pending, (state) => {
        state.loading.cantidadCajas = true;
        state.data = { ...state.data, cantidad: 0 };
        state.error = null;
      })
      .addCase(fetchCantidadCajas.fulfilled, (state, action) => {
        state.loading.cantidadCajas = false;
        state.data = { ...state.data, cantidad: { ...(state.data.cantidad as CantidadCajas), ...(action.payload as CantidadCajas) } };
      })
      .addCase(fetchCantidadCajas.rejected, (state, action) => {
        state.loading.cantidadCajas = false;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchCajas.pending, (state) => {
        state.loading.busqueda = true;
        state.data = { ...state.data, cajas: [] };
        state.error = null;
      })
      .addCase(fetchCajas.fulfilled, (state, action) => {
        state.loading.busqueda = false;
        state.data = { ...state.data, cajas: action.payload };
      })
      .addCase(fetchCajas.rejected, (state, action) => {
        state.loading.busqueda = false;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(exportCajas.pending, (state) => {
        state.loading.exportacion = true;
        state.error = null;
      })
      .addCase(exportCajas.fulfilled, (state) => {
        state.loading.exportacion = false;
      })
      .addCase(exportCajas.rejected, (state, action) => {
        state.loading.exportacion = false;
        state.error = action.error.message ?? null;
      });
  },
});

const { setFilters, clearFilters, clearState } = slice.actions;

export { fetchCantidadCajas, fetchCajas, exportCajas, setFilters, clearFilters, clearState };

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
*/
