import * as retryAxios from 'retry-axios';
import axios from 'axios';

retryAxios.attach(axios);

axios.defaults.timeout = 30000;
axios.defaults.headers = {
  accept: 'application/json',
  'content-Type': 'application/json',
};
axios.defaults.raxConfig = {
  retry: 3,
  retryDelay: 1000,
  backoffType: 'static',
  httpMethodsToRetry: [/* 'POST',  */ 'GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
};
