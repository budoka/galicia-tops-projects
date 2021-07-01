import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { RootState } from 'src/app/store';
import {
  GetMonedaDTO,
  GetCorresponsalDTO,
  GetConceptoDTO,
  GetClienteDTO,
  GetInfoProductosDTO,
  GetCuentaDTO,
  GetPaisDTO,
} from 'src/features/shared/data/dto/common.dto';
import { Cliente, CuentaProducto } from 'src/features/shared/data/types';
import { getAccountFormat } from 'src/utils/galicia';
import { BancoCorresponsal, Concepto, Cuenta, Moneda, Pais } from '../../nueva-solicitud/data/types';

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

    // Respuesta del servicio
    const response = await axios.request<GetMonedaDTO[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const monedas = responseData.map((m) => ({
      id: m.iso,
      descripcion: `${m.iso} (${m.descripcion})`,
    })) as Moneda[];

    return monedas;
  },
);

export const fetchPaises = createAsyncThunk<Pais[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchPaises',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['PAISES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<GetPaisDTO[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const monedas = responseData.map((p) => ({
      id: p.id,
      nombre: p.descripcion,
    })) as Pais[];

    return monedas;
  },
);

export const fetchCorresponsales = createAsyncThunk<BancoCorresponsal[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchCorresponsales',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['CORRESPONSALES'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<GetCorresponsalDTO[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const corresponsales = responseData.map((c) => ({
      id: c.codigo,
      nombre: c.nombre,
    })) as BancoCorresponsal[];

    return corresponsales;
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

    // Respuesta del servicio
    const response = await axios.request<GetConceptoDTO[]>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const conceptos = responseData.map((c) => ({
      id: c.codigo,
      descripcion: `${c.codigo} (${c.descripcion})`,
    })) as Concepto[];

    return conceptos;
  },
);

export const fetchDatosClientes = createAsyncThunk<Cliente[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchDatosClientes',
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
    const clientes: Cliente[] = responseData.map(
      (c) =>
        ({
          ...c,
          tipo: c.tipo.toLowerCase(),
          documentos: c.documentos.map((d) => ({ tipo: d.tipo, descripcion: d.descripcion, numero: d.id })),
          //    documentos: c.documentos.map((d) => ({ tipo: d.tipo, descripcion: d.descripcion, numero: d.numero })),
        } as Cliente),
    );

    return clientes;
  },
);

export const fetchCuentas = createAsyncThunk<Cuenta[], RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchCuentas',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['COMMON'];
    const resource = api.resources['PRODUCTOS'];

    const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<GetInfoProductosDTO>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    let infoProductos: GetInfoProductosDTO = responseData;

    const cuentas = infoProductos.productos.cuentas.map((cuenta) => {
      const valor = getAccountFormat(cuenta.monedaIso, cuenta.codigo, cuenta.numero);
      return {
        ...cuenta,
        id: valor,
        label: valor,
        valor,
      } as Cuenta;
    });

    return cuentas;
  },
);
