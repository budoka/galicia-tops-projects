import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as Global from 'src/helpers/global.helper';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import { ConnectedRouter } from 'connected-react-router';
import { App } from 'src/app';
import { history, persistor, store } from 'src/app/store';
import es from 'antd/lib/locale-provider/es_ES';
import 'moment/locale/es';
import 'src/styles/global.less'; // last

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={es}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </ConfigProvider>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root'),
);

Global.runServiceWorker(false);
Global.BindStore();
