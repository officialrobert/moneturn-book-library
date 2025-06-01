import {
  ENVIRONMENT,
  PORT,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} from '@/environment';
import { checkDatabaseConnection } from '@/db';
import { insertIfInitialDataForAuthorAndBooksNotPresent } from '@/helpers';

import ApiRoutes from '@/routes';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import path from 'path';

export const app = fastify({
  logger: false,
  trustProxy: true,
});

app.register(cors, {
  origin: true,
});

app.register(ApiRoutes, { prefix: '/v1' });

app.setErrorHandler(async (err, _request, reply) => {
  const msg = err?.message || '';
  const code = reply?.statusCode;

  if (code < 300) {
    reply.code(500);
  }

  reply.header('Content-Type', 'application/json; charset=utf-8');
  reply.send({
    message: `ERR: ${msg ? `${msg}` : 'Something went wrong'}`,
  });
});

app.register(fastifyStatic, {
  root: path.join(__dirname, './assets/images'),
  prefix: '/assets/images/',
  decorateReply: false,
  setHeaders: (res) => {
    // Set permissive CORS headers for all static assets
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Range',
    );
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    // Set cache control for better performance
    res.setHeader('Cache-Control', 'public, max-age=86400');
  },
});

export async function main() {
  try {
    console.log('RUNNING ENVIRONMENT: ', ENVIRONMENT);
    console.log('POSTGRES_HOST: ', POSTGRES_HOST);
    console.log('POSTGRES_PORT: ', POSTGRES_PORT);
    console.log('POSTGRES_USER: ', POSTGRES_USER);
    console.log('POSTGRES_PASSWORD: ', POSTGRES_PASSWORD);
    console.log('POSTGRES_DB: ', POSTGRES_DB);

    const dbConnected = await checkDatabaseConnection();

    if (dbConnected) {
      // Start server
      await app.listen({ port: PORT });
      await insertIfInitialDataForAuthorAndBooksNotPresent();
      console.log('SERVER RUNNING ON PORT: ', PORT);
    }
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION: ', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION: ', reason);
  process.exit(1);
});
