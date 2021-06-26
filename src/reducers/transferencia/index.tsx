import { combineReducers } from '@reduxjs/toolkit';

import nuevaSolicitudReducer from 'src/features/transferencia/nueva-solicitud';

const reducers = {
  nuevaSolicitud: nuevaSolicitudReducer,
};

export default combineReducers({
  ...reducers,
});
