import { combineReducers } from '@reduxjs/toolkit';

import listaMensajesReducer from 'src/features/mensaje/lista-mensajes/logic';
import infoMensajeReducer from 'src/features/mensaje/info-mensaje/logic';

const reducers = {
  listaMensajes: listaMensajesReducer,
  infoMensaje: infoMensajeReducer,
};

export default combineReducers({
  ...reducers,
});
