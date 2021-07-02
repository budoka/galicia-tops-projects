import React from 'react';
import { NotFound } from 'src/components/not-found';
import { Unavailable } from 'src/components/unavailable';
import { Texts } from 'src/constants/texts';
import { ListaMensajes } from 'src/features/mensaje/lista-mensajes/ui';
import { NuevaSolicitud } from 'src/features/transferencia/nueva-solicitud/ui';
import { Inicio } from 'src/views/inicio';
import { View } from 'src/views/types';

/* Definición de las vistas de la aplicación */

export interface Views {
  //Inicio: View;
  Mensajes: View;
  Crear_Solicitud_Orden_De_Pago: View;
  Crear_Instruccion_Orden_De_Pago: View;
  Crear_Solicitud_Transferencia: View;
  Not_Found: View;
}

const views: Views = {
  //Inicio: { title: Texts.HOME, path: '/', component: <Inicio />, scope: 'user.read' },
  Mensajes: { title: Texts.MESSAGES, path: '/mensajes', component: <ListaMensajes />, scope: 'user.read', homePage: true },
  Crear_Solicitud_Orden_De_Pago: {
    title: Texts.NEW_REQUEST,
    path: '/orden-de-pago/nueva-solicitud',
    component: <Unavailable />,
    scope: 'user.read',
  },
  Crear_Instruccion_Orden_De_Pago: {
    title: Texts.NEW_INSTRUCTION,
    path: '/orden-de-pago/nueva-instruccion',
    component: <Unavailable />,
    scope: 'user.read',
  },
  Crear_Solicitud_Transferencia: {
    title: Texts.NEW_REQUEST,
    path: '/transferencia/nueva-solicitud',
    component: <NuevaSolicitud />,
    scope: 'user.read',
  },
  // Not Found
  Not_Found: { title: Texts.NOT_FOUND, path: undefined, component: <NotFound /> },
};

export * from 'src/views/types';
export { views };
