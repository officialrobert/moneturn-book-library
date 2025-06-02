import {
  addNewAuthorInfoController,
  deleteAuthorInfoController,
  getAuthorInfoByIdController,
  getAuthorListByPageController,
  searchAuthorsMatchController,
  updateAuthorInfoByIdController,
} from '@/controllers';
import {
  addNewAuthorInfoSchema,
  deleteAuthorByIdSchema,
  getAuthorByIdSchema,
  getAuthorListByPageSchema,
  searchAuthorsMatchSchema,
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

  fastify.get(
    '/list',
    { schema: getAuthorListByPageSchema },
    getAuthorListByPageController,
  );

  fastify.get(
    '/search',
    { schema: searchAuthorsMatchSchema },
    searchAuthorsMatchController,
  );
}
