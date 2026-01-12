import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless'; 
import ws from 'ws';

// Mandatory for Node.js environments
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
  neonConfig.pipelineConnect = false; // Can improve stability for some queries
  neonConfig.useSecureWebSocket = true;
}

const prismaClientSingleton = () => {
  const isUnpooled = !!process.env.DATABASE_URL_UNPOOLED;
  const baseEnvUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

  if (!baseEnvUrl) {
    throw new Error("Database connection string is missing in environment variables");
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Prisma] Initializing with ${isUnpooled ? 'DIRECT' : 'POOLED'} connection.`);
  }

  // 1. Use a URL object to safely append parameters without breaking the string
  const url = new URL(baseEnvUrl);
  url.searchParams.set('connect_timeout', '60');
  url.searchParams.set('pool_timeout', '60');
  // Ensure pgbouncer is disabled for the serverless adapter
  url.searchParams.delete('pgbouncer');

  const connectionString = url.toString();

  const adapter = new PrismaNeon({ connectionString });

  const client = new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
    errorFormat: 'pretty', // Make error messages more readable
  });

  // Manually log error events to ensure we see the details in the server terminal
  client.$on('error', (e) => {
    // If the message is empty, it's likely a WebSocket closure
    if (!e.message && e.target) {
      console.error(`[Prisma Error] The connection was closed by the server during: ${e.target}.`);
      console.error(`This often happens if the result set is too large or the connection limit was reached.`);
    } else {
      console.error('Detailed Prisma Error:', JSON.stringify(e, null, 2));
    }
  });

  return client;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;