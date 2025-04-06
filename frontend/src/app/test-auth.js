"use client";
import { useAuth0 } from '@auth0/auth0-react';

export default function TestAuth() {
  const { isAuthenticated, isLoading, error, user } = useAuth0();
  
  if (isLoading) {
    return <div>Auth0 is loading...</div>;
  }
  
  if (error) {
    return <div>Auth0 Error: {error.message}</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Auth0 Test Page</h1>
      <div>
        Authentication status: {isAuthenticated ? 'Logged in' : 'Not logged in'}
      </div>
      {isAuthenticated && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
    </div>
  );
}