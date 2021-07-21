import { buildBaseURL } from 'src/api/utils/api';
import { APIList } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['COMMON'];
// const { verb, path, headers } = resources['MONEDAS'];
export const apis: APIList = {
  COMMON: {
    baseURL: buildBaseURL('GATEWAY', { extraSuffix: 'api/v1/common' }),
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
    baseURL: buildBaseURL('GATEWAY', { extraSuffix: 'api/v1/mensaje' }),
    resources: {
      AGREGAR_MENSAJE: { path: 'Mensaje/PostManual', config: { verb: 'POST', timeout: 40000, retries: 0 } },
      MENSAJE: { path: 'Mensaje/:id', config: { verb: 'GET' } },
      MENSAJES: { path: 'Mensaje/GetByFilter', config: { verb: 'POST' } },
    },
  },
  TRANSFERENCIA: {
    baseURL: buildBaseURL('GATEWAY', { hostSuffix: '', extraSuffix: 'api/v1/transferencia' }),
    resources: {
      AGREGAR_SOLICITUD: { debugUrl: 'https://localhost:8001/api/v1/Solicitudes', path: 'Solicitudes', config: { verb: 'POST', timeout: 40000, retries: 0 } },
      SOLICITUDES: { path: 'Solicitudes', config: { verb: 'GET' } },
    },
  },
  SOLICITUD: {
    baseURL: buildBaseURL('GATEWAY', { extraSuffix: 'api/v1/solicitud' }),
    resources: {
      INSTRUIR_SOLICITUD: {
        //debugUrl: 'https://localhost:44336/api/v1/Solicitud/InstruirSolicitud',
        path: 'Solicitud/InstruirSolicitud',
        config: { verb: 'POST', timeout: 40000, retries: 0 },
      },
      SOLICITUD: { path: 'Solicitud/:id', config: { verb: 'GET' } },
      SOLICITUDES: { path: 'Solicitud/GetSolicitudByFilter', config: { verb: 'GET' } },
    },
  },
  SECOPA: {
    baseURL: buildBaseURL('GATEWAY', { extraSuffix: 'api/v1/secopa' }),
    resources: {
      CONCEPTOS: { path: 'Comex/ConceptosBoletos', config: { verb: 'GET' } },
    },
  },
};
