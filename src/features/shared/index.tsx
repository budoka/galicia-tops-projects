import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { RootState } from 'src/reducers';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { getFreshToken } from 'src/utils/auth';
import { Moneda, MonedaResponse, UIState, Banco, BancoResponse, Concepto, ConceptoResponse, Persona, Cuenta, InfoProductos } from './types';

const FEATURE_NAME = 'shared';

// Async actions

export const fetchMonedas = createAsyncThunk<Moneda[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchMonedas',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    /*   const api = apis['COMMON'];
    const resource = api.resources['MONEDA'];
    const config = buildAxiosRequestConfig(api, resource, options); */

    const endpoint = 'https://gateway-exto-tops-dev.devcloud.bancogalicia.com.ar/api/v1/Moneda';
    const verb = 'GET';
    const headers = {
      ...options?.headers,
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<MonedaResponse[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const monedas = responseData.map((moneda) => {
      return {
        value: moneda.iso,
        label: `${moneda.iso} (${moneda.descripcion})`,
      };
    }) as Moneda[];

    return monedas;
  },
);

export const fetchCorresponsales = createAsyncThunk<Banco[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchCorresponsales',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    /*   const api = apis['COMMON'];
    const resource = api.resources['MONEDA'];
    const config = buildAxiosRequestConfig(api, resource, options); */

    const endpoint = 'https://common-exto-tops-dev.devcloud.bancogalicia.com.ar/api/v1/Corresponsal';
    const verb = 'GET';
    const headers = {
      ...options?.headers,
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<BancoResponse[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const bancos = responseData.map((banco) => {
      return {
        value: banco.codigo,
        label: banco.nombre,
        pais: {
          value: banco.pais.id,
          label: banco.pais.descripcion,
        },
      };
    }) as Banco[];

    return bancos;
  },
);

export const fetchConceptos = createAsyncThunk<Concepto[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchConceptos',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    /*   const api = apis['COMMON'];
    const resource = api.resources['MONEDA'];
    const config = buildAxiosRequestConfig(api, resource, options); */

    const endpoint = 'https://common-exto-tops-dev.devcloud.bancogalicia.com.ar/api/v1/Concepto';
    const verb = 'GET';
    const headers = {
      ...options?.headers,
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<ConceptoResponse[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const conceptos = responseData.map((concepto) => {
      return {
        value: concepto.codigo,
        label: `${concepto.codigo} (${concepto.descripcion})`,
      };
    }) as Concepto[];

    return conceptos;
  },
);

export const fetchDatosPersonas = createAsyncThunk<Persona[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchDatosPersona',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    /* const api = apis['TRANSFERENCIA'];
    const resource = api.resources['SOLICITUDES'];*/

    const endpoint = 'https://localhost:8001/api/Solicitudes';
    const verb = 'GET';
    const headers = {
      ...options?.headers,
      /*  Accept: 'application/json',
      'Content-Type': 'application/json',*/
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };

    console.log(config);

    /*const api = apis['COMMON'];
    const resource = api.resources['DATOS_PERSONAS'];*/

    //const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<Persona[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const personas: Persona[] = responseData;

    return personas;
  },
);

export const fetchProductos = createAsyncThunk<InfoProductos, RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchProductos',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['PRODUCTOS'];

    const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<InfoProductos>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    let productos: InfoProductos = responseData;
    const cuentas = productos.productos.cuentas.map((cuenta) => {
      const value = `${cuenta.codigo} | ${cuenta.moneda.iso} | ${cuenta.numero}`;
      return {
        ...cuenta,
        key: value,
        label: value,
        value,
      };
    });
    productos.productos.cuentas = cuentas;

    return productos;
  },
);
