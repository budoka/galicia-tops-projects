import React from 'react';
import { NotFound } from 'src/components/not-found';
import { Unavailable } from 'src/components/unavailable';
import { Texts } from 'src/constants/texts';
import { ListaMensajes } from 'src/features/mensaje/lista-mensajes/ui';
import { ODPNuevaSolicitud } from 'src/features/orden-de-pago/nueva-solicitud/ui';
import { TXNuevaSolicitud } from 'src/features/transferencia/nueva-solicitud/ui';
import { View } from 'src/views/types';

/* Definición de las vistas de la aplicación */

export interface Views {
  //Inicio: View;
  Mensajes: View;
  Solicitudes_Orden_De_Pago: View;
  Crear_Solicitud_Orden_De_Pago: View;
  Crear_Instruccion_Orden_De_Pago: View;
  Solicitudes_Transferencia: View;
  Crear_Solicitud_Transferencia: View;
  Not_Found: View;
}

export const views: Views = {
  //Inicio: { title: Texts.HOME, path: '/', component: <Inicio />, scope: 'user.read' },
  Mensajes: { title: Texts.MESSAGES, path: '/mensajes', component: <ListaMensajes />, scope: 'user.read', homePage: true },
  Solicitudes_Orden_De_Pago: {
    title: Texts.REQUESTS,
    path: '/orden-de-pago/solicitudes',
    component: <Unavailable />,
    scope: 'user.read',
  },
  Crear_Solicitud_Orden_De_Pago: {
    title: Texts.NEW_REQUEST,
    path: '/orden-de-pago/nueva-solicitud',
    component: <ODPNuevaSolicitud />,
    scope: 'user.read',
  },
  Crear_Instruccion_Orden_De_Pago: {
    title: Texts.NEW_INSTRUCTION,
    path: '/orden-de-pago/nueva-instruccion',
    component: <Unavailable />,
    scope: 'user.read',
  },
  Solicitudes_Transferencia: {
    title: Texts.REQUESTS,
    path: '/transferencia/solicitudes',
    component: <Unavailable />,
    scope: 'user.read',
  },
  Crear_Solicitud_Transferencia: {
    title: Texts.NEW_REQUEST,
    path: '/transferencia/nueva-solicitud',
    component: <TXNuevaSolicitud />,
    scope: 'user.read',
  },
  // Not Found
  Not_Found: { title: Texts.NOT_FOUND, path: undefined, component: <NotFound /> },
};

export const getHomePage = () => {
  const viewsArray = Object.values(views) as View[];
  const homePage = viewsArray.find((v) => v.homePage)?.path ?? '/';

  return homePage;
};
