import { buildBaseURL } from 'src/api/utils/api';
import { APIList } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['COMMON'];
// const { verb, path, headers } = resources['MONEDAS'];
export const apis: APIList = {
  COMMON: {
    baseURL: buildBaseURL('COMMON'),
    resources: {
      CONCEPTOS: { path: 'api/v1/Concepto', config: { verb: 'GET' } },
      CORRESPONSALES: { path: 'api/v1/Corresponsal', config: { verb: 'GET' } },
      DATOS_CLIENTES: { path: 'api/v1/ConsultaCliente/GetDatosPersonas', config: { verb: 'GET' } },
      MONEDAS: { path: 'api/v1/moneda', config: { verb: 'GET' } },
      PAISES: { path: 'api/v1/pais', config: { verb: 'GET' } },
      PRODUCTOS: { path: 'api/v1/ConsultaPosicion/GetProductos', config: { verb: 'GET' } },
    },
  },
  GATEWAY: {
    baseURL: buildBaseURL('GATEWAY'),
    resources: {
      MENSAJE: { path: 'api/v1/Mensaje', config: { verb: 'GET' } },
      MENSAJES: { path: 'api/v1/Mensaje/GetByFilter', config: { verb: 'POST' } },
    },
  },
  TRANSFERENCIA: {
    baseURL: buildBaseURL('TRANSFERENCIA'),
    resources: {
      AGREGAR_SOLICITUD: { path: 'api/v1/Solicitudes', config: { verb: 'POST' } },
      SOLICITUDES: { path: 'api/v1/Solicitudes', config: { verb: 'GET' } },
    },
  },
};
