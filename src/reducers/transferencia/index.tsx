import { combineReducers } from '@reduxjs/toolkit';

import nuevaSolicitudReducer from 'src/features/transferencia/nueva-solicitud/logic';
import solicitudesReducer from 'src/features/transferencia/solicitudes/lista-solicitudes/logic';

const reducers = {
  nuevaSolicitud: nuevaSolicitudReducer,
  solicitudes: solicitudesReducer,
};

export default combineReducers({
  ...reducers,
});
