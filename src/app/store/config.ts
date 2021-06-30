import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import logger from 'redux-logger';
import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { history, RootState } from '.';

interface Configuration {
  devTools: boolean;
  middlewares: Array<{ middleware: Middleware<{}, any, Dispatch<AnyAction>>; enabled: boolean }>;
  persistence: PersistConfig<RootState>;
}

export const config = {
  devTools: process.env.NODE_ENV !== 'production',
  persistence: {
    key: 'AppStore',
    storage,
    whitelist: ['menu', 'sesion', 'transferencias'],
  },
  middlewares: [
    {
      middleware: logger,
      enabled: false && process.env.NODE_ENV !== 'production',
    },
    {
      middleware: routerMiddleware(history),
      enabled: true,
    },
  ],
} as Configuration;
