import { combineReducers } from '@reduxjs/toolkit';

import nuevaSolicitudReducer from 'src/features/orden-de-pago/nueva-solicitud/logic';
// import solicitudesReducer from 'src/features/orden-de-pago/solicitudes/lista-solicitudes/logic';

const reducers = {
  nuevaSolicitud: nuevaSolicitudReducer,
  // solicitudes: solicitudesReducer,
};

export default combineReducers({
  ...reducers,
});
