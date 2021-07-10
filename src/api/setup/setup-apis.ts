import { buildBaseURL } from 'src/api/utils/api';
import { APIList } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['COMMON'];
// const { verb, path, headers } = resources['MONEDAS'];
export const apis: APIList = {
  COMMON: {
    baseURL: buildBaseURL('GATEWAY', 'api/v1/common'),
    resources: {
      CONCEPTOS: { path: 'Concepto', config: { verb: 'GET' } },
      CORRESPONSALES: { path: 'Corresponsal', config: { verb: 'GET' } },
      DATOS_CLIENTES: { path: 'ConsultaCliente/GetDatosPersonas', config: { verb: 'GET' } },
      MONEDAS: { path: 'Moneda', config: { verb: 'GET' } },
      PAISES: { path: 'Pais', config: { verb: 'GET' } },
      PRODUCTOS: { path: 'ConsultaPosicion/GetProductos', config: { verb: 'GET' } },
    },
  },
  MENSAJE: {
    baseURL: buildBaseURL('GATEWAY', 'api/v1/mensaje'),
    resources: {
      AGREGAR_MENSAJE: { path: 'Mensaje/PostManual', config: { verb: 'POST' } },
      MENSAJE: { path: 'Mensaje/:id', config: { verb: 'GET' } },
      MENSAJES: { path: 'Mensaje/GetByFilter', config: { verb: 'POST' } },
    },
  },
  TRANSFERENCIA: {
    baseURL: buildBaseURL('GATEWAY', 'api/v1/transferencia'),
    resources: {
      AGREGAR_SOLICITUD: { path: 'Solicitudes', config: { verb: 'POST' } },
      SOLICITUDES: { path: 'Solicitudes', config: { verb: 'GET' } },
    },
  },
  SOLICITUD: {
    baseURL: buildBaseURL('GATEWAY', 'api/v1/solicitud'),
    resources: {
      AGREGAR_SOLICITUD: { path: 'Solicitudes', config: { verb: 'POST' } },
      SOLICITUDES: { path: 'Solicitudes', config: { verb: 'GET' } },
    },
  },
};
