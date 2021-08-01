import { buildBaseURL } from 'src/api/utils/api.utils';
import { APIList } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['GATEWAY'];
// const { verb, path, headers } = resources['USERS_GET_ONE'];
export const apis: APIList = {
  GATEWAY: {
    baseURL: buildBaseURL('GATEWAY', { domainSuffix: '/api/v1' }),
    resources: {
      AUTH_LOGIN: { path: 'auth/login', config: { verb: 'POST' } },
      AUTH_REGISTER: { path: 'auth/register', config: { verb: 'POST' } },
      AUTH_TOKEN: { path: 'auth/token', config: { verb: 'POST' } },
      USERS_GET_ONE: { path: 'users/:id', config: { verb: 'GET' } },
      USERS_GET_MANY: { path: 'users', config: { verb: 'GET' } },
      DEVELOPERS_GET_ONE: { path: 'developers/:id', config: { verb: 'GET' } },
    },
  },
};
