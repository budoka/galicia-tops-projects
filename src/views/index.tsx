import React from 'react';
import { NotFound } from 'src/components/not-found';
import { Unavailable } from 'src/components/unavailable';
import { Texts } from 'src/constants/texts';
import { Login } from 'src/features/auth/ui';
import { ListaMensajes } from 'src/features/mensaje/lista-mensajes/ui';
import { View } from 'src/views/types';

/* Definición de las vistas de la aplicación */

export interface Views {
  Auth: View;
  Home: View;
  Not_Found: View;
}

export const views: Views = {
  Auth: { path: '/auth', component: <Login /> },
  Home: { title: Texts.HOME, path: '/home', component: <ListaMensajes />, scope: 'admin', homePage: true },
  // Not Found
  Not_Found: { title: Texts.NOT_FOUND, path: undefined, component: <NotFound /> },
};

export const getHomePage = () => {
  const viewsArray = Object.values(views) as View[];
  const homePage = viewsArray.find((v) => v.homePage)?.path ?? '/';

  return homePage;
};
