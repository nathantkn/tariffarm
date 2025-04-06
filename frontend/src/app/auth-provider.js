"use client";
import { Auth0Provider } from '@auth0/auth0-react';

export default function AuthProvider({ children }) {
  console.log("Auth provider rendering");
  console.log("Domain:", process.env.NEXT_PUBLIC_AUTH0_DOMAIN);
  console.log("Client ID:", process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID);
  
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
    >
      {children}
    </Auth0Provider>
  );
}