import prisma from "@/lib/prisma";

export default async function TestPage() {
  try {
    // This simple query tests the Neon adapter connection
    const result = await prisma.$queryRaw`SELECT NOW()`;
    
    return (
      <div className="p-8">
        <h1 className="text-green-600 font-bold">Connection Successful!</h1>
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-red-600 font-bold">Connection Failed</h1>
        <p className="text-sm text-gray-500">Check your DATABASE_URL in .env</p>
        <pre className="mt-4 bg-red-50 p-4 rounded text-xs">
          {String(error)}
        </pre>
      </div>
    );
  }
}
