import { useCallback } from 'react';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { message } from 'antd';
import { API, Resource, RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';

export const doRequest = async <RequestBody = void, ResponseBody = unknown>(
  api: API<unknown>,
  resource: Resource,
  config?: RequestConfig<RequestBody>,
) => {
  const requestData = config?.data;

  // Configuracion del servicio
  const axiosConfig = buildAxiosRequestConfig(api, resource, { ...config, data: requestData });

  // Respuesta del servicio
  const response = await axios.request<ResponseBody>(axiosConfig);
  const responseData = response.data;

  return responseData;
};

export const cancelRequest = (source: CancelTokenSource) => {
  if (source) source.cancel();
};
