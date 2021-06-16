import { UserAgentApplication } from 'msal';

export const getFreshToken = (msalInstance: UserAgentApplication) => {
  if (!msalInstance) return;
  const clientId = 'f688eaea-0d00-43aa-b7f8-5ea3a1770cc3';
  return msalInstance
    .acquireTokenSilent({ scopes: [clientId] })
    .then((r) => r.idToken.rawIdToken)
    .catch((e) => msalInstance.acquireTokenRedirect({ scopes: [clientId] }));
  // (await gS.msalInstance.acquireTokenSilent({ scopes: ["user.read"] })).idToken.rawIdToken
};
