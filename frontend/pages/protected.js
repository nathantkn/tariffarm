// pages/protected.js
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../src/components/ProtectedRoute';
import api from '../services/api';
import Link from 'next/link';
import Head from 'next/head';

export default function ProtectedPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getProtectedResource = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await api.getPrivateResource(token);
        setMessage(response.message);
      } catch (e) {
        setError(e.message);
      }
    };

    getProtectedResource();
  }, [getAccessTokenSilently]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>Protected | Auth0 Next.js Sample</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-4xl font-bold mb-8">Protected Page</h1>
          
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}
          
          <div className="mt-4">
            <Link href="/" className="text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}