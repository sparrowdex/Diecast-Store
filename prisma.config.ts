import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import path from 'path';

// Manually load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts',
  },
});