import { combineReducers } from '@reduxjs/toolkit';

import nuevaSolicitudReducer from 'src/features/orden-de-pago/nueva-solicitud/logic';
import nuevaInstruccionReducer from 'src/features/orden-de-pago/nueva-instruccion/logic';
// import solicitudesReducer from 'src/features/orden-de-pago/solicitudes/lista-solicitudes/logic';

const reducers = {
  nuevaSolicitud: nuevaSolicitudReducer,
  nuevaInstruccion: nuevaInstruccionReducer,
  // solicitudes: solicitudesReducer,
};

export default combineReducers({
  ...reducers,
});
