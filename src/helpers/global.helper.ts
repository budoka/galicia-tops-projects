import * as serviceWorker from 'src/service-worker';
import { store } from 'src/app/store';

declare global {
  interface Window {
    [key: string]: any;
  }
}

// Allow the access to the store state through the window.store.
export function BindStore() {
  window.store = () => store.getState();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
export function runServiceWorker(allow = true) {
  if (allow) serviceWorker.register();
  else serviceWorker.unregister();
}
