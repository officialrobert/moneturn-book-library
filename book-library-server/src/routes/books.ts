import {
  getBookByIdController,
  getBooksByPageController,
  insertNewBookController,
  searchBooksMatchController,
} from '@/controllers';
import {
  getBookByIdSchema,
  getBooksByPageShema,
  insertNewBookSchema,
  searchBooksMatchSchema,
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
}
