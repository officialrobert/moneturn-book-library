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
import ApiRoutes from '@/routes';
import fastify from 'fastify';

export const app = fastify({
  logger: false,
  trustProxy: true,
});

app.register(ApiRoutes, { prefix: '/v1' });

app.setErrorHandler(async (err, request, reply) => {
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

export async function main() {
  try {
    console.log('RUNNING ENVIRONMENT: ', ENVIRONMENT);
    console.log('POSTGRES_HOST: ', POSTGRES_HOST);
    console.log('POSTGRES_PORT: ', POSTGRES_PORT);
    console.log('POSTGRES_USER: ', POSTGRES_USER);
    console.log('POSTGRES_PASSWORD: ', POSTGRES_PASSWORD);
    console.log('POSTGRES_DB: ', POSTGRES_DB);

    await checkDatabaseConnection();
    // Start server
    await app.listen({ port: PORT });

    console.log('SERVER RUNNING ON PORT: ', PORT);
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
