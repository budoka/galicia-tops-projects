// Para agregar una nueva API, se debe actualizar las interfaces en el siguiente orden:
// 1) Agregar una nueva interface 'Resource<Nombre>'.
// 2) Definir los recursos necesarios dentro de la interface creada.
// 3) Definir la api dentro de la interface 'APIs', proveyendo la interface creada en el paso 1.

import { API, Resource } from '../types';

export interface APIList {
  COMMON: API<ResourcesCommon>;
  GATEWAY: API<ResourcesGateway>;
  TRANSFERENCIA: API<ResourcesTransferencia>;
}

// Resources

export interface ResourcesCommon {
  DATOS_PERSONAS: Resource;
  MONEDA: Resource;
  PRODUCTOS: Resource;
}

export interface ResourcesGateway {
  MENSAJE: Resource;
  MENSAJES: Resource;
}

export interface ResourcesTransferencia {
  AGREGAR_SOLICITUD: Resource;
  SOLICITUDES: Resource;
}
