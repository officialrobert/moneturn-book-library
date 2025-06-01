import {
  getBookByIdController,
  getBooksByPageController,
  insertNewBookController,
  searchBooksMatchController,
  updateBookInfoByIdController,
} from '@/controllers';
import {
  getBookByIdSchema,
  getBooksByPageShema,
  insertNewBookSchema,
  searchBooksMatchSchema,
  updateBookInfoByIdSchema,
} from '@/schemas';
import { FastifyInstance } from 'fastify';

export default async function BooksRoutes(
  fastify: FastifyInstance,
): Promise<void> {
  fastify.get(
    '/list',
    { schema: getBooksByPageShema },
    getBooksByPageController,
  );
  fastify.get(
    '/search',
    { schema: searchBooksMatchSchema },
    searchBooksMatchController,
  );
  fastify.post('/', { schema: insertNewBookSchema }, insertNewBookController);
  fastify.get('/:id', { schema: getBookByIdSchema }, getBookByIdController);
  fastify.patch(
    '/:id',
    { schema: updateBookInfoByIdSchema },
    updateBookInfoByIdController,
  );
}
