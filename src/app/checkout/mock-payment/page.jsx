import { Suspense } from 'react';
import MockPaymentClient from './MockPaymentClient';

// A simple loading fallback component
const Loading = () => {
  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-black">Secure_Gateway</h1>
          <div className="text-[10px] font-mono bg-black text-white px-2 py-1">TEST_MODE</div>
        </div>
        <div className="space-y-4 mb-8">
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="w-full bg-gray-300 h-14 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MockPaymentClient />
    </Suspense>
  );
}