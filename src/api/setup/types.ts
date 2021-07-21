// Para agregar una nueva API, se debe actualizar las interfaces en el siguiente orden:
// 1) Agregar una nueva interface 'Resource<Nombre>'.
// 2) Definir los recursos necesarios dentro de la interface creada.
// 3) Definir la api dentro de la interface 'APIs', proveyendo la interface creada en el paso 1.

import { API, Resource } from '../types';

export interface APIList {
  COMMON: API<ResourcesCommon>;
  MENSAJE: API<ResourcesMensaje>;
  TRANSFERENCIA: API<ResourcesTransferencia>;
  SOLICITUD: API<ResourcesSolicitud>;
  SECOPA: API<ResourcesSecopa>;
}

// Resources

export interface ResourcesCommon {
  CONCEPTOS: Resource;
  CORRESPONSALES: Resource;
  DATOS_CLIENTES: Resource;
  MONEDAS: Resource;
  PAISES: Resource;
  PRODUCTOS: Resource;
}

export interface ResourcesMensaje {
  AGREGAR_MENSAJE: Resource;
  MENSAJE: Resource;
  MENSAJES: Resource;
}

export interface ResourcesTransferencia {
  AGREGAR_SOLICITUD: Resource;
  SOLICITUDES: Resource;
}

export interface ResourcesSolicitud {
  INSTRUIR_SOLICITUD: Resource;
  SOLICITUD: Resource;
  SOLICITUDES: Resource;
}

export interface ResourcesSecopa {
  CONCEPTOS: Resource;
}
