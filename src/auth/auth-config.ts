import * as msal from '@azure/msal-browser';
import { Configuration } from '@azure/msal-browser';
import { isIE } from 'src/utils/browser';

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: 'f688eaea-0d00-43aa-b7f8-5ea3a1770cc3',
    authority: 'https://login.microsoftonline.com/934de3fe-416c-4e4c-b035-32df9344eac4',
    //authority: 'https://login.microsoftonline.com/9eea4475-3e4a-4124-9621-552fa654f21c', Tenant No Prod
    redirectUri: window.location.origin,
  },

  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: isIE(), // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    //iframeHashTimeout: 10000,
    //tokenRenewalOffsetSeconds: 60,
    loggerOptions: {
      loggerCallback: (level: msal.LogLevel, message: string, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            // console.error(message);
            return;
          case msal.LogLevel.Info:
            //  console.info(message);
            return;
          case msal.LogLevel.Verbose:
            // console.debug(message);
            return;
          case msal.LogLevel.Warning:
            //   console.warn(message);
            return;
        }
      },
    },
  },
};
