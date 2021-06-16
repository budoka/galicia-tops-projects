import { buildBaseURL } from 'src/api/utils/api';
import { APIList } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['CAJA'];
// const { verb, path, headers } = resources['PREVIEW'];
export const apis: APIList = {
  COMMON: {
    baseURL: buildBaseURL('COMMON'),
    resources: {
      DATOS_PERSONAS: { path: 'api/v1/ConsultaCliente/GetDatosPersonas', config: { verb: 'GET' } },
      MONEDA: { path: 'api/v1/moneda', config: { verb: 'GET' } },
      PRODUCTOS: { path: 'api/v1/ConsultaPosicion/GetProductos', config: { verb: 'GET' } },
    },
  },
  GATEWAY: {
    baseURL: buildBaseURL('GATEWAY'),
    resources: {
      MENSAJE: { path: 'api/Mensaje', config: { verb: 'GET' } },
      MENSAJES: { path: 'api/Mensaje/GetByFilter', config: { verb: 'POST' } },
    },
  },
  TRANSFERENCIA: {
    baseURL: buildBaseURL('TRANSFERENCIA'),
    resources: {
      AGREGAR_SOLICITUD: { path: 'api/Solicitudes', config: { verb: 'POST' } },
      SOLICITUDES: { path: 'api/Solicitudes', config: { verb: 'GET' } },
    },
  },
};
