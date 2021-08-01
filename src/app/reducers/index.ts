import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from 'src/features/auth/logic';

import mensaje from 'src/app/reducers/mensaje.reducer';
import configuracionReducer from 'src/features/configuracion/configuracion.slice';
import menuReducer from 'src/features/navigator-menu/logic';
import sharedReducer from 'src/features/_shared/logic';

const reducers = {
  auth: authReducer,
  mensaje,
  configuracion: configuracionReducer,
  menu: menuReducer,
  shared: sharedReducer,
};

export const createRootReducer = (history: History) => {
  return combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
};
