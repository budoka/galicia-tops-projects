import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { API, HttpRequest, Placeholders, Resource } from 'src/api/types';
import { getVar, getVarOrNull } from 'src/configuration/configuration.utils';

/**
 * Build the url of an API.
 * @param apiId api's id
 * @param extra extra reference
 */
export function buildBaseURL(apiId: string, extra?: { domainPrefix?: string; domainSuffix?: string }) {
  const domainPrefix = extra?.domainPrefix || '';
  const domainSuffix = extra?.domainSuffix || '';

  const PREFIX_API = 'API_';
  const prefix = getVarOrNull(PREFIX_API + 'PREFIX') || '';
  const suffix = getVarOrNull(PREFIX_API + apiId + '_SUFFIX') || '';
  apiId = getVar(PREFIX_API + apiId).toString();

  return prefix + domainPrefix + apiId + suffix + domainSuffix;
  // return (getVarOrNull('API_URL_DEBUG')?.toString() ?? prefix + apiId + suffix) + extraSuffix;
}

/**
 * Build the endpoint of a request.
 * @param baseURL request's base url
 * @param resource request's resource
 * @param placeholders request's placeholders (e.g: replace 'https//example.com/users/:userId/inventory/:inventoryId' with 'https//example.com/users/10000/inventory/50')
 */
export function buildEndpoint(baseURL: string, path: string, placeholders?: Placeholders) {
  const _placeholders = placeholders ? Object.entries(placeholders) : undefined;
  let _path = path;
  if (_placeholders) _path = _placeholders.reduce((url, ph) => url.replace(`:${ph[0]}`, ph[1].toString()), _path);
  return `${baseURL}/${_path}`.toLowerCase();
}

/**
 * Build the axios request config.
 * @param api API
 * @param resource request's resource
 * @param config request's configuration
 */
export function buildAxiosRequestConfig<ResourceType, Data>(api: API<ResourceType>, resource: Resource, config: HttpRequest<Data> = {}) {
  const { baseURL } = api;
  const { path, config: defaultOptions, debugUrl } = resource;
  const { placeholders, cancelToken } = config!;
  const endpoint = debugUrl ?? buildEndpoint(baseURL, path, placeholders);
  const verb = config?.verb ?? defaultOptions?.verb;
  const headers = { ...defaultOptions?.headers, ...config?.headers };
  const query = { ...defaultOptions?.query, ...config?.query };
  const body = { ...defaultOptions?.body, ...config?.body };
  const timeout = config?.timeout ?? defaultOptions?.timeout;
  const retries = config?.retries ?? defaultOptions?.retries;

  const axiosConfig: AxiosRequestConfig = {
    method: verb,
    url: endpoint,
    headers,
    params: query,
    data: body,
    cancelToken,
    timeout,
    raxConfig: {
      ...axios.defaults.raxConfig,
      retry: retries,
    },
  };

  return axiosConfig;
}

/**
 * Get expiration unix time
 * @param value value value *15*
 * @param unit default value *second*
 */
export function getExpirationTime(value = 15, unit: 'second' | 'minute' = 'second') {
  return moment().add(value, unit).unix();
}
