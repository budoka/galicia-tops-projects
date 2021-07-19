import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InfoSesion, SesionSliceState } from './types';

const FEATURE_NAME = 'sesion';

// Async actions
/*
const fetchInfoSesion = createAsyncThunk<InfoSesion, RequestConfig<InfoAzure>, { state: RootState }>(
  FEATURE_NAME + '/fetchInfoSesion',
  async (config, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Mapeo de la solicitud
    const requestData: InfoAzure = {
      ...config.data,
    };

    // Configuracion del servicio
    const api = apis['INFO_SESION'];
    const resource = api.resources['INFO_SESION'];
    const axiosConfig = buildAxiosRequestConfig(api, resource, { ...config, data: requestData });

    // Respuesta del servicio
    const response = await axios.request<SesionResponseBody>(axiosConfig);
    const responseData = response.data;

    // Mapeo de la respuesta
    const infoSesion: InfoSesion = {
      idUsuario: responseData.idUsuario,
      idSector: responseData.idSector,
      nombreSector: responseData.descripcionSector,
      perfil: responseData.roles && responseData.roles.length > 0 ? responseData.roles[0].descripcion : undefined,
      legajo: config.data?.legajo,
      nombreUsuario: config.data?.nombreUsuario,
    };

    return infoSesion;
  },
);
*/
// Slice

const initialState: SesionSliceState = {
  data: {},
  loading: false,
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setUsuario(state, action: PayloadAction<InfoSesion>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    /*   builder
      .addCase(fetchInfoSesion.pending, (state) => {
        state.loading = true;
        state.data = {};
        state.error = null;
      })
      .addCase(fetchInfoSesion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInfoSesion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error de prueba';
      });*/
  },
});

const { setUsuario } = slice.actions;

export { setUsuario };

export default slice.reducer;
