import { defineConfig, Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config);
