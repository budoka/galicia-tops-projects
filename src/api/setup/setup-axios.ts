import * as retryAxios from 'retry-axios';
import axios from 'axios';

retryAxios.attach(axios);
axios.defaults.timeout = 30000;
axios.defaults.headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
axios.defaults.raxConfig = {
  retry: 5,
  retryDelay: 1000,
  backoffType: 'static',
  httpMethodsToRetry: ['GET', 'POST', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
};
