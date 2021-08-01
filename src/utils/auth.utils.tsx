import { store } from 'src/app/store';
import jwt, { JwtHeader } from 'jwt-decode';
import { property } from 'lodash';

export interface JwtToken {
  header: JwtHeader;
  payload: JwtPayload;
}

export interface JwtPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export const getPayloadProperty = (token: string, property: string) => {
  const decodedToken = jwt<any>(token);
  return decodedToken[property];
};

export const tokenIsExpiredOrNull = (token?: string) => {
  if (!token) return true;

  const decodedToken = jwt<JwtPayload>(token);
  const tokenExpirationTime = decodedToken.exp * 1000;
  const currentTime = new Date().getTime();

  const tokenExpired = tokenExpirationTime < currentTime;

  return tokenExpired;
};
