import 'dotenv/config';

export const ENVIRONMENT = process.env.NODE_ENV || 'development';

export const PORT = parseFloat(process.env.PORT) || 3001;

export const POSTGRES_PORT = parseFloat(process.env.POSTGRES_PORT) || 5432;

export const POSTGRES_HOST = process.env.POSTGRES_HOST || '';

export const POSTGRES_USER = process.env.POSTGRES_USER || '';

export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';

export const POSTGRES_DB = process.env.POSTGRES_DB || '';

export const DATABASE_URL = process.env.DATABASE_URL || '';

export const isDevelopment = ENVIRONMENT === 'development';

export const isProduction = ENVIRONMENT === 'production';

export const SERVER_BASE_URL = process.env.SERVER_BASE_URL || '';
