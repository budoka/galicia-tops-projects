import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { RootState } from 'src/reducers';
import { GetClienteDTO, GetConceptoDTO, GetCorresponsalDTO, GetCuentaDTO, GetInfoProductosDTO, GetMonedaDTO } from './dto/common';
import { Banco, Cliente, Concepto, Moneda } from './types';

const FEATURE_NAME = 'shared';

// Async actions

export const fetchMonedas = createAsyncThunk<Moneda[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchMonedas',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['MONEDAS'];
    const config = buildAxiosRequestConfig(api, resource, options);

    /*   const endpoint = 'https://gateway-exto-tops-dev.devcloud.bancogalicia.com.ar/api/v1/Moneda';
    const verb = 'GET';
    const headers = {
      ...options?.headers,
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };*/

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<GetMonedaDTO[]>(config);
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
    const api = apis['COMMON'];
    const resource = api.resources['CORRESPONSALES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    /* const endpoint = 'https://common-exto-tops-dev.devcloud.bancogalicia.com.ar/api/v1/Corresponsal';
    const verb = 'GET';
    const headers = {
      ...options?.headers,
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };*/

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<GetCorresponsalDTO[]>(config);
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
    const api = apis['COMMON'];
    const resource = api.resources['CONCEPTOS'];
    const config = buildAxiosRequestConfig(api, resource, options);

    /*     const endpoint = 'https://common-exto-tops-dev.devcloud.bancogalicia.com.ar/api/v1/Concepto';
    const verb = 'GET';
    const headers = {
      ...options?.headers,
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers }; */

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<GetConceptoDTO[]>(config);
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

export const fetchDatosClientes = createAsyncThunk<Cliente[], RequestConfig | undefined, { state: RootState }>(
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
    const clientes: Cliente[] = responseData.map((c) => ({ ...c, tipo: c.tipo.toLowerCase() } as Cliente));

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
        /*   key: value,
        label: value, */
        valor,
      } as GetCuentaDTO;
    });

    infoProductos.productos.cuentas = cuentas;
    console.log(infoProductos);
    return infoProductos;
  },
);
