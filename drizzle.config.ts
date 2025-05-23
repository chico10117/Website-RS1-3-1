import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default {
  schema: './src/lib/server/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
} satisfies Config; 