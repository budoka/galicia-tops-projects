import { combineReducers } from '@reduxjs/toolkit';

import nuevaTransferenciaReducer from 'src/features/transferencias/nueva-transferencia';

const reducers = {
  nuevaTransferencia: nuevaTransferenciaReducer,
};

export default combineReducers({
  ...reducers,
});
