import { getAuthorInfoByIdController } from '@/controllers';
import { getAuthorByIdSchema } from '@/schemas';
import { FastifyInstance } from 'fastify';

export async function AuthorRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/authors/:id',
    { schema: getAuthorByIdSchema },
    getAuthorInfoByIdController,
  );
}
