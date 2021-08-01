import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/api-list.config';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api.utils';
import { rejectRequest } from 'src/api/utils/axios.utils';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { getPayloadProperty } from 'src/utils/auth.utils';
import { sleep } from 'src/utils/common.utils';
import { GetAccessTokenDto, LoginDto, RegisterDto, SessionDto } from '../data/dto';
import { AuthState } from '../data/types';

const FEATURE_NAME = 'auth';

const SLEEP_TIME = 150;

//#region Async actions

export const login = createHttpAsyncThunk<LoginDto, SessionDto, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/login',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['GATEWAY'];
    const resource = api.resources['AUTH_LOGIN'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<SessionDto>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    } finally {
      await sleep(SLEEP_TIME);
    }
    // Mapeo de la respuesta
    const responseData = response.data;

    return { status: response.status, data: responseData } as HttpResponse<SessionDto>;
  },
);

export const register = createHttpAsyncThunk<RegisterDto, SessionDto, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/register',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    // Configuracion del servicio
    const api = apis['GATEWAY'];
    const resource = api.resources['AUTH_REGISTER'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<SessionDto>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    } finally {
      await sleep(SLEEP_TIME);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    return { status: response.status, data: responseData } as HttpResponse<SessionDto>;
  },
);

export const getAccessToken = createHttpAsyncThunk<GetAccessTokenDto, Pick<SessionDto, 'accessToken'>, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/getAccessToken',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    // Configuracion del servicio
    const api = apis['GATEWAY'];
    const resource = api.resources['AUTH_TOKEN'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<Pick<SessionDto, 'accessToken'>>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    return { status: response.status, data: responseData } as HttpResponse<Pick<SessionDto, 'accessToken'>>;
  },
);

//#endregion

const initialState: AuthState = {
  data: {},
  ui: {},
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    logout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.data.login = { loading: true };
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data.login = { ...state.data.login, response: action.payload, loading: false };
        state.data.session = { ...action.payload.data!, username: getPayloadProperty(action.payload.data?.accessToken!, 'username') };
      })
      .addCase(login.rejected, (state, action) => {
        state.data.login = { ...state.data.login, response: undefined, loading: false, error: action.payload };
      });
    builder
      .addCase(register.pending, (state, action) => {
        state.data.register = { loading: true };
      })
      .addCase(register.fulfilled, (state, action) => {
        state.data.register = { ...state.data.register, response: action.payload, loading: false };
        state.data.session = { ...action.payload.data!, username: getPayloadProperty(action.payload.data?.accessToken!, 'username') };
      })
      .addCase(register.rejected, (state, action) => {
        state.data.register = { ...state.data.register, response: undefined, loading: false, error: action.payload };
      });
    builder
      .addCase(getAccessToken.pending, (state, action) => {
        state.data.getAccessToken = { loading: true };
      })
      .addCase(getAccessToken.fulfilled, (state, action) => {
        state.data.getAccessToken = { ...state.data.getAccessToken, response: action.payload, loading: false };
        state.data.session = { ...state.data.session!, ...action.payload.data! };
      })
      .addCase(getAccessToken.rejected, (state, action) => {
        state.data.getAccessToken = { ...state.data.getAccessToken, response: undefined, loading: false, error: action.payload };
      });
  },
});

const { logout } = slice.actions;

export { logout };

export default slice.reducer;
