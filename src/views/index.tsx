import React from 'react';
import { NotFound } from 'src/components/not-found';
import { Unavailable } from 'src/components/unavailable';
import { Texts } from 'src/constants/texts';
import { Inicio } from 'src/views/inicio';
import { View } from 'src/views/types';
import { NuevaTransferencia } from './transferencia/nueva-transferencia';

/* Definición de las vistas de la aplicación */

export interface Views {
  Inicio: View;
  Mensajes: View;
  Solicitudes: View;
  Crear_Solicitud: View;
  Crear_Transferencia: View;
  Not_Found: View;
}

const views: Views = {
  Inicio: { title: Texts.HOME, path: '/', component: <Inicio />, scope: 'user.read' },
  Mensajes: { title: Texts.MESSAGES, path: '/mensajes', component: <Unavailable />, scope: 'user.read' },
  Solicitudes: { title: Texts.REQUESTS, path: '/solicitudes', component: <Unavailable />, scope: 'user.read' },
  Crear_Solicitud: { title: Texts.NEW_REQUEST, path: '/nueva-solicitud', component: <Unavailable />, scope: 'user.read' },
  Crear_Transferencia: { title: Texts.NEW_TRANSFER, path: '/nueva-transferencia', component: <NuevaTransferencia />, scope: 'user.read' },
  // Not Found
  Not_Found: { title: Texts.NOT_FOUND, path: undefined, component: <NotFound /> },
};

export * from 'src/views/types';
export { views };
