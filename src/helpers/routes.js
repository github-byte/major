import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export function IsUserRedirect({ user, loggedInPath, children,path, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        if (!user) {
          return children;
        }

        // if (user) {
        //   return (
        //     <Redirect
        //       to={{
        //         pathname: loggedInPath,
        //       }}
        //     />
        //   );
        // }

        return path;
      }}
    />
  );
}

export function ProtectedRoute({ user, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return children;
        // if (user) {
        // }

        // if (!user) {
        //   return (
        //     <Redirect
        //       to={{
        //         pathname: 'signin',
        //         state: { from: location },
        //       }}
        //     />
        //   );
        // }

        // return null;
      }}
    />
  );
}
