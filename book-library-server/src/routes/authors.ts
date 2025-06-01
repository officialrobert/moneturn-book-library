import {
  addNewAuthorInfoController,
  getAuthorInfoByIdController,
} from '@/controllers';
import { addNewAuthorInfoSchema, getAuthorByIdSchema } from '@/schemas';
import { FastifyInstance } from 'fastify';

export default async function AuthorRoutes(
  fastify: FastifyInstance,
): Promise<void> {
  fastify.get(
    '/:id',
    { schema: getAuthorByIdSchema },
    getAuthorInfoByIdController,
  );
  fastify.post(
    '/',
    { schema: addNewAuthorInfoSchema },
    addNewAuthorInfoController,
  );
}
