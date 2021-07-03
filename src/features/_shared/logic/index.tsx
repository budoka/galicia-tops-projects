import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { rejectRequest } from 'src/api/utils/axios';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { Cuenta } from 'src/features/transferencia/nueva-solicitud/data/interfaces';
import { getAccountFormat } from 'src/utils/galicia';
import { GetClienteDTO, GetConceptoDTO, GetCorresponsalDTO, GetInfoProductosDTO, GetMonedaDTO, GetPaisDTO } from '../data/dtos/common.dto';
import { BancoCorresponsal, Cliente, Concepto, Moneda, Pais, SharedState } from '../data/interfaces';

const FEATURE_NAME = 'shared';

export const fetchMonedas = createHttpAsyncThunk<void, Moneda[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchMonedas',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['MONEDAS'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetMonedaDTO[]>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const monedas = responseData.map((m) => ({
      id: m.iso,
      descripcion: `${m.iso} (${m.descripcion})`,
    })) as Moneda[];

    return { status: response.status, data: monedas } as HttpResponse<Moneda[]>;
  },
);

export const fetchPaises = createHttpAsyncThunk<void, Pais[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchPaises',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['PAISES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetPaisDTO[]>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const pais = responseData.map((p) => ({
      id: p.id,
      nombre: p.descripcion,
    })) as Pais[];

    return { status: response.status, data: pais } as HttpResponse<Pais[]>;
  },
);

export const fetchCorresponsales = createHttpAsyncThunk<void, BancoCorresponsal[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchCorresponsales',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['CORRESPONSALES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetCorresponsalDTO[]>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const corresponsales = responseData.map((c) => ({
      id: c.codigo,
      nombre: c.nombre,
    })) as BancoCorresponsal[];

    return { status: response.status, data: corresponsales } as HttpResponse<BancoCorresponsal[]>;
  },
);

export const fetchConceptos = createHttpAsyncThunk<void, Concepto[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchConceptos',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['CONCEPTOS'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetConceptoDTO[]>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const conceptos = responseData.map((c) => ({
      id: c.codigo,
      descripcion: `${c.codigo} (${c.descripcion})`,
    })) as Concepto[];

    return { status: response.status, data: conceptos } as HttpResponse<Concepto[]>;
  },
);

export const fetchDatosClientes = createHttpAsyncThunk<void, Cliente[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchDatosClientes',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['DATOS_CLIENTES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetClienteDTO[]>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const clientes: Cliente[] = responseData.map(
      (c) =>
        ({
          ...c,
          tipo: c.tipo.toLowerCase(),
          documentos: c.documentos.map((d) => ({ tipo: d.tipo, descripcion: d.descripcion, numero: d.id })),
          //    documentos: c.documentos.map((d) => ({ tipo: d.tipo, descripcion: d.descripcion, numero: d.numero })),
        } as Cliente),
    );

    return { status: response.status, data: clientes } as HttpResponse<Cliente[]>;
  },
);

export const fetchCuentas = createHttpAsyncThunk<void, Cuenta[], { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/fetchCuentas',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['PRODUCTOS'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<GetInfoProductosDTO>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    const infoProductos: GetInfoProductosDTO = responseData;

    const cuentas = infoProductos.productos.cuentas.map((cuenta) => {
      const valor = getAccountFormat(cuenta.monedaIso, cuenta.codigo, cuenta.numero);
      return {
        ...cuenta,
        id: valor,
        label: valor,
        valor,
      };
    }) as Cuenta[];

    return { status: response.status, data: cuentas } as HttpResponse<Cuenta[]>;
  },
);

const initialState: SharedState = {};

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
      .addCase(fetchMonedas.pending, (state) => {
        state.monedas = { value: [], loading: true };
      })
      .addCase(fetchMonedas.fulfilled, (state, action) => {
        state.monedas = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchMonedas.rejected, (state, action) => {
        state.monedas = { value: [], loading: false, error: action.payload };
      });
    builder
      .addCase(fetchPaises.pending, (state) => {
        state.paises = { value: [], loading: true };
      })
      .addCase(fetchPaises.fulfilled, (state, action) => {
        state.paises = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchPaises.rejected, (state, action) => {
        state.paises = { value: [], loading: false, error: action.payload };
      });
    builder
      .addCase(fetchCorresponsales.pending, (state) => {
        state.corresponsales = { value: [], loading: true };
      })
      .addCase(fetchCorresponsales.fulfilled, (state, action) => {
        state.corresponsales = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchCorresponsales.rejected, (state, action) => {
        state.corresponsales = { value: [], loading: false, error: action.payload };
      });
    builder
      .addCase(fetchConceptos.pending, (state) => {
        state.conceptos = { value: [], loading: true };
      })
      .addCase(fetchConceptos.fulfilled, (state, action) => {
        state.conceptos = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchConceptos.rejected, (state, action) => {
        state.conceptos = { value: [], loading: false, error: action.payload };
      });
  },
});

const { cleanState } = slice.actions;

export { cleanState };

export default slice.reducer;
