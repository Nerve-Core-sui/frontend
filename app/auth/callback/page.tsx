'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useZkLogin } from '@/hooks/useZkLogin';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { handleCallback, isProcessing, error } = useZkLogin();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleCallback();
        // Redirect to home page after successful authentication
        router.push('/');
      } catch (err) {
        console.error('Authentication failed:', err);
        // Stay on page to show error
      }
    };

    processCallback();
  }, [handleCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          {isProcessing ? (
            <>
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authenticating...
              </h2>
              <p className="text-gray-600">
                Generating your zkLogin proof. This may take a moment.
              </p>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Success!
              </h2>
              <p className="text-gray-600">
                Redirecting...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
