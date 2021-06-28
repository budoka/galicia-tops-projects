import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { RootState } from 'src/app/store';
import { GetClienteDTO, GetConceptoDTO, GetCorresponsalDTO, GetCuentaDTO, GetInfoProductosDTO, GetMonedaDTO } from '../data/dto/common.dto';

const FEATURE_NAME = 'shared';

// Async actions
/* 
export const fetchMonedas = createAsyncThunk<GetMonedaDTO[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchMonedas',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['MONEDAS'];
    const config = buildAxiosRequestConfig(api, resource, options);

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<GetMonedaDTO[]>(config);
    const responseData = response.data;

    return responseData;
  },
);

export const fetchCorresponsales = createAsyncThunk<GetCorresponsalDTO[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchCorresponsales',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['CORRESPONSALES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<GetCorresponsalDTO[]>(config);
    const responseData = response.data;

    return responseData;
  },
);

export const fetchConceptos = createAsyncThunk<GetConceptoDTO[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchConceptos',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['CONCEPTOS'];
    const config = buildAxiosRequestConfig(api, resource, options);

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<GetConceptoDTO[]>(config);
    const responseData = response.data;

    return responseData;
  },
);

export const fetchDatosClientes = createAsyncThunk<GetClienteDTO[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchDatosPersona',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['DATOS_CLIENTES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<GetClienteDTO[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const clientes: GetClienteDTO[] = responseData.map(
      (c) =>
        ({
          ...c,
          tipo: c.tipo.toLowerCase(),
          //    documentos: c.documentos.map((d) => ({ tipo: d.tipo, descripcion: d.descripcion, numero: d.numero })),
        } as GetClienteDTO),
    );

    return clientes;
  },
);

export const fetchProductos = createAsyncThunk<GetInfoProductosDTO, RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchProductos',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['PRODUCTOS'];

    const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<GetInfoProductosDTO>(config);
    const responseData = response.data;
    console.log(responseData);
    // Mapeo de la respuesta
    let infoProductos: GetInfoProductosDTO = responseData;

    const cuentas = infoProductos.productos.cuentas.map((cuenta) => {
      const valor = `${cuenta.codigo} | ${cuenta.monedaIso} | ${cuenta.numero}`;
      return {
        ...cuenta,
      //   key: value,
    //    label: value, 
        valor,
      } as GetCuentaDTO;
    });

    infoProductos.productos.cuentas = cuentas;
    console.log(infoProductos);
    return infoProductos;
  },
);
 */
