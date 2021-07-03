import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from '@reduxjs/toolkit';
import mensaje from 'src/reducers/mensaje';
import transferencia from 'src/reducers/transferencia';
import configuracionReducer from 'src/features/configuracion/configuracion.slice';
import menuReducer from 'src/features/navigator-menu/logic';
import sesionReducer from 'src/features/sesion/sesion.slice';
import sharedReducer from 'src/features/_shared/logic';

const reducers = {
  mensaje,
  transferencia,
  configuracion: configuracionReducer,
  menu: menuReducer,
  sesion: sesionReducer,
  shared: sharedReducer,
};

export const createRootReducer = (history: History) => {
  return combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
};
