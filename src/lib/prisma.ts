import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless'; 
import ws from 'ws';

// Mandatory for Node.js environments
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`;

  // Pass the string directly to PrismaNeon (Best practice for v7)
  // This avoids manually creating a 'Pool' and handles the connection correctly
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;