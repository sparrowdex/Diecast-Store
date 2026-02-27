import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts',
  },
});