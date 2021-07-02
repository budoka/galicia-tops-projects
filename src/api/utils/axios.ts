import axios, { AxiosError, CancelTokenSource } from 'axios';
import { API, HttpRequest, HttpResponse, Resource } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';

const REQUEST_TIMEOUT = 408;

export const doRequest = async <RequestBody = void, ResponseBody = unknown>(api: API<unknown>, resource: Resource, config?: HttpRequest<RequestBody>) => {
  const body = config?.body;

  // Configuracion del servicio
  const axiosConfig = buildAxiosRequestConfig(api, resource, { ...config, body });

  // Respuesta del servicio
  const response = await axios.request<ResponseBody>(axiosConfig);
  const responseData = response.data;

  return responseData;
};

export const cancelRequest = (source: CancelTokenSource) => {
  if (source) source.cancel();
};

export const rejectRequest = (err: AxiosError, thunkApi: any) => {
  console.log({ ...err });
  const { data, status } = (err as AxiosError).response || {};
  const error: HttpResponse = { data, status: status ?? REQUEST_TIMEOUT };

  return thunkApi.rejectWithValue(error);
};
