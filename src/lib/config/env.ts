import { z } from 'zod';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { DATABASE_URL } from '$env/static/private';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  PUBLIC_FACEBOOK_APP_ID: z.string().min(1),
  PUBLIC_APPLE_CLIENT_ID: z.string().min(1),
  APPLE_CLIENT_SECRET: z.string().min(1),
});

// This will throw if the environment variables are not set correctly
const env = envSchema.parse({
  DATABASE_URL: DATABASE_URL,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  PUBLIC_GOOGLE_CLIENT_ID: PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  PUBLIC_FACEBOOK_APP_ID: process.env.PUBLIC_FACEBOOK_APP_ID,
  PUBLIC_APPLE_CLIENT_ID: process.env.PUBLIC_APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
});

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error('PUBLIC_GOOGLE_CLIENT_ID is not defined');
}

export default env;
export { DATABASE_URL, PUBLIC_GOOGLE_CLIENT_ID }; 