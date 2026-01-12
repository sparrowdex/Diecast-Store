'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or the console
    // This is where you'll see the "real" Prisma error details 
    // that get swallowed by the default Next.js 500 page.
    console.error('Application Error:', error);
  }, [error]);

  // Detect if this is a serialized Prisma error or a silent connection failure
  const isPrismaError = 
    error.message?.includes('clientVersion') ||
    error.message?.includes('Prisma') || 
    error.digest?.includes('prisma') ||
    (!error.message && error.digest);

  const displayMessage = isPrismaError 
    ? "The database connection was interrupted. This usually happens due to an unstable internet connection (like a mobile hotspot) or a large data transfer. Please check your connection and try again."
    : error.message || "We encountered an unexpected error.";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {displayMessage}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}