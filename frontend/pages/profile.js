// pages/profile.js
import { useAuth0 } from '@auth0/auth0-react';
import Profile from '../src/components/Profile';
import ProtectedRoute from '../src/components/ProtectedRoute';
import Link from 'next/link';
import Head from 'next/head';

export default function ProfilePage() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>Profile | Auth0 Next.js Sample</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20">
          <h1 className="text-4xl font-bold mb-8">Profile</h1>
          <Profile />
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