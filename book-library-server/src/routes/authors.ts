import {
  addNewAuthorInfoController,
  deleteAuthorInfoController,
  getAuthorInfoByIdController,
  updateAuthorInfoByIdController,
} from '@/controllers';
import {
  addNewAuthorInfoSchema,
  deleteAuthorByIdSchema,
  getAuthorByIdSchema,
  updateAuthorInfoByIdSchema,
} from '@/schemas';
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
  fastify.delete(
    '/:id',
    { schema: deleteAuthorByIdSchema },
    deleteAuthorInfoController,
  );
  fastify.patch(
    '/:id',
    { schema: updateAuthorInfoByIdSchema },
    updateAuthorInfoByIdController,
  );
}
