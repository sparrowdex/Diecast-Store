import { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

const Loading = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-12 inline-block">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"></div>
                    <div className="h-16 md:h-20 bg-gray-200 rounded w-3/4 mx-auto animate-pulse mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>
                <div className="border-y border-black/5 py-8 mb-12 flex flex-col md:flex-row justify-around gap-8">
                    <div className="text-center w-1/2">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto animate-pulse mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                    </div>
                    <div className="text-center w-1/2">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto animate-pulse mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                    </div>
                </div>
                <div className="h-16 bg-gray-300 w-64 mx-auto animate-pulse"></div>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderSuccessClient />
    </Suspense>
  );
}
