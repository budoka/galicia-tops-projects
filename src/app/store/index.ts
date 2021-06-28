import { Action, AnyAction, configureStore, Dispatch, Middleware, ThunkAction } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { createRootReducer } from 'src/reducers';
import { config } from './config';

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
//export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
