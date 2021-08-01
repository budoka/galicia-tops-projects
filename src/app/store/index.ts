import { Action, AnyAction, AsyncThunk, AsyncThunkPayloadCreator, configureStore, Dispatch, Middleware, ThunkAction } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { createRootReducer } from 'src/app/reducers';
import { config } from './store.config';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpResponse, HttpRequest } from 'src/api/types';

export const history = createBrowserHistory();

const persistedReducer = persistReducer(config.persistence, createRootReducer(history));

// Select the middlewares.
const middlewares: Middleware<{}, any, Dispatch<AnyAction>>[] = config.middlewares.filter((m) => m.enabled).map((m) => m.middleware);

export const store = configureStore({
  devTools: config.devTools,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export function createHttpAsyncThunk<RequestBody, ResponseBody, ThunkApiConfig>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<HttpResponse<ResponseBody>, HttpRequest<RequestBody>, ThunkApiConfig>,
): AsyncThunk<HttpResponse<ResponseBody>, HttpRequest<RequestBody>, ThunkApiConfig> {
  return createAsyncThunk<HttpResponse<ResponseBody>, HttpRequest<RequestBody>, ThunkApiConfig>(typePrefix, payloadCreator);
}
