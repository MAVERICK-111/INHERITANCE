import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <button
      onClick={() =>
        logout({
          returnTo: window.location.origin, // Redirect to the homepage or desired route after logout
        })
      }
    >
      Log Out
    </button>
  ) : (
    <button onClick={() => loginWithRedirect()}>Log In</button>
  );
};
