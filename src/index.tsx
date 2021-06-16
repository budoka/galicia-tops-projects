import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { ConfigProvider } from 'antd';
import es from 'antd/lib/locale-provider/es_ES';
import 'moment/locale/es';
import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from 'src/service-worker';
import { history, persistor, store } from 'src/store';
import { AuthProvider } from './auth/hook/useAzureAuth';
import { App } from 'src/app';
import * as Msal from 'msal';
import 'src/styles/global.less'; // last
import { UserAgentApplication } from 'msal';

/* if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  const ReactRedux = require('react-redux/lib');
  whyDidYouRender(React, {
    //trackAllPureComponents: true,
   // trackHooks: true,
   // trackExtraHooks: [[ReactRedux, 'useSelector']],
  });
}
 */

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={es}>
        <ConnectedRouter history={history}>
          <AuthProvider disabled>
            <App />
          </AuthProvider>
        </ConnectedRouter>
      </ConfigProvider>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

declare global {
  interface Window {
    [key: string]: any;
  }
}

window.store = () => store.getState();
