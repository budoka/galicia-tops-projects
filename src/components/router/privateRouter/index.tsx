import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { Session } from 'src/features/auth/data/types';
import { getPayloadProperty } from 'src/utils/auth.utils';

export interface PrivateRouteProps extends RouteProps {
  session: Session;
  loginRedirect: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ session, loginRedirect, children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        getPayloadProperty(session.refreshToken, 'role') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: loginRedirect,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
