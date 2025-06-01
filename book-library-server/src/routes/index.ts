import { FastifyInstance } from 'fastify';

import AuthorRoutes from './authors';
import BooksRoutes from './books';

export default async function ApiRoutes(app: FastifyInstance): Promise<void> {
  app.register(AuthorRoutes, { prefix: '/authors' });
  app.register(BooksRoutes, { prefix: '/books' });
}
