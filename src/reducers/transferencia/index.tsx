import { combineReducers } from '@reduxjs/toolkit';

import nuevaSolicitudReducer from 'src/features/transferencia/nueva-solicitud/logic';

const reducers = {
  nuevaSolicitud: nuevaSolicitudReducer,
};

export default combineReducers({
  ...reducers,
});
