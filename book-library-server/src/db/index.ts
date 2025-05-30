import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { DATABASE_URL } from '@/environment';
import * as schema from './schema';

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool, { schema, casing: 'snake_case' });

/**
 * Checks if the database connection is successful.
 * @returns {Promise<boolean>} A promise that resolves to true if the connection is successful, false otherwise.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT NOW()`);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export * from './schema';
