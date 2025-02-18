'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error') || '';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">
              {error === 'CredentialsSignin' ? 'Invalid credentials' : error}
            </div>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">Loading...</span>
            ) : (
              <span className="flex items-center">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 12.151c0 .81-.614 1.396-1.365 1.396-.752 0-1.365-.586-1.365-1.396 0-.81.614-1.397 1.365-1.397.751 0 1.365.587 1.365 1.397zm1.2 0c0-1.294-1.012-2.597-2.565-2.597-1.552 0-2.565 1.303-2.565 2.597 0 1.293 1.013 2.487 2.565 2.487 1.553 0 2.565-1.194 2.565-2.487zm3.31-2.598c0 .773-.616 1.399-1.368 1.399-.753 0-1.369-.626-1.369-1.399 0-.773.617-1.369 1.369-1.369.752 0 1.368.596 1.368 1.369zm1.2 0c0-1.265-1.016-2.57-2.568-2.57-1.552 0-2.568 1.305-2.568 2.57 0 1.264 1.016 2.458 2.568 2.458 1.552 0 2.568-1.194 2.568-2.458zm3.31 2.598c0 .81-.614 1.396-1.366 1.396-.752 0-1.365-.586-1.365-1.396 0-.81.613-1.397 1.365-1.397.752 0 1.366.587 1.366 1.397zm1.2 0c0-1.294-1.012-2.597-2.566-2.597-1.553 0-2.566 1.303-2.566 2.597 0 1.293 1.013 2.487 2.566 2.487 1.554 0 2.566-1.194 2.566-2.487z" />
                </svg>
                Sign in with Google
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}