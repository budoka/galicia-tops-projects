import * as retryAxios from 'retry-axios';
import axios from 'axios';

retryAxios.attach(axios);

axios.defaults.timeout = 20000;
axios.defaults.headers = {
  accept: 'application/json',
  'content-Type': 'application/json',
};
axios.defaults.raxConfig = {
  retry: 3,
  retryDelay: 1000,
  backoffType: 'static',
  httpMethodsToRetry: ['GET', 'POST', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
};
