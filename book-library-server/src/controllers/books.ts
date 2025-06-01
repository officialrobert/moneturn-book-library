import { FastifyReply, FastifyRequest } from 'fastify';
import { eq, desc, and, sql, isNull, or, gt, ilike } from 'drizzle-orm';
import { db, books } from '@/db';
import { head, isNumber } from 'lodash';
import { IBook, IPagination } from '@/types';
import {
  createNewBook,
  deleteBookById,
  getBookInfoById,
  getNowDateInISOString,
  updateBookPropsById,
} from '@/helpers';
import { v4 as uuid } from 'uuid';

/**
 * Insert new book record.
 *
 * @param {FastifyRequest<{Body: {title: string;shortSummary: string;imagePreview: string;authorId: string;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ book: IBook }>}
 */
export async function insertNewBookController(
  request: FastifyRequest<{
    Body: {
      title: string;
      shortSummary: string;
      imagePreview: string;
      authorId: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ book: IBook }> {
  const { title, shortSummary, imagePreview, authorId } = request.body;
  const bookId = uuid();
  const today = getNowDateInISOString();

  if (!title || !shortSummary || !authorId || !imagePreview) {
    reply.status(400);
    throw new Error(
      "'title', 'shortSummary', 'imagePreview', and 'authorId' are required",
    );
  }

  const newBook = await createNewBook({
    id: bookId,
    title,
    shortSummary,
    imagePreview,
    authorId,
    createdAt: today.toISOString(),
    updatedAt: null,
    deletedAt: null,
  });

  reply.status(201);
  return { book: newBook };
}

/**
 * Get book info by id.
 *
 * @param {FastifyRequest<{Params: {id: string;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ book: IBook }>}
 */
export async function getBookByIdController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ book: IBook }> {
  const { id } = request.params;
  const bookInfo = await getBookInfoById(id);

  if (!bookInfo) {
    reply.status(404);
    throw new Error('Book not found');
  }

  reply.status(200);
  return { book: bookInfo };
}

/**
 * Get books list by page.
 *
 * @param {FastifyRequest<{Querystring: {page: number;limit: number;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ books: IBook[]; pagination: IPagination }>}
 */
export async function getBooksByPageController(
  request: FastifyRequest<{
    Querystring: {
      page: number;
      limit: number;
    };
  }>,
  reply: FastifyReply,
): Promise<{ books: IBook[]; pagination: IPagination }> {
  const { page, limit } = request.query;
  const offset = (page - 1) * limit;
  const currentDate = getNowDateInISOString();

  const [booksResult, totalCount] = await Promise.all([
    db
      .select({
        id: books.id,
      })
      .from(books)
      .where(or(isNull(books.deletedAt), gt(books.deletedAt, currentDate)))
      .orderBy(desc(books.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql`count(*)` })
      .from(books)
      .where(or(isNull(books.deletedAt), gt(books.deletedAt, currentDate))),
  ]);

  const booksEnriched = await Promise.all(
    booksResult.map(async (book) => {
      const bookInfo = await getBookInfoById(book.id, true);
      return bookInfo;
    }),
  );

  reply.status(200);
  return {
    books: booksEnriched,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(Number(head(totalCount)?.count) / limit),
      totalItems: Number(head(totalCount)?.count),
      itemsPerPage: limit,
    },
  };
}

/**
 * Update book info by id.
 *
 * @param {FastifyRequest<{Params: {id: string;};Body: {title: string;shortSummary: string;imagePreview: string;authorId: string;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ book: IBook } | null>} Returns updated book info or throws error if book not found.
 */
export async function updateBookInfoByIdController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: {
      title?: string;
      shortSummary?: string;
      imagePreview?: string;
      authorId?: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ book: IBook } | null> {
  const { id } = request.params;
  const { title, shortSummary, imagePreview, authorId } = request.body;

  if (!title && !shortSummary && !imagePreview && !authorId) {
    reply.status(400);
    throw new Error(
      "'title', 'shortSummary', 'imagePreview', or 'authorId' is required",
    );
  }

  const updatedBook = await updateBookPropsById(
    id,
    {
      ...(title && { title }),
      ...(shortSummary && { shortSummary }),
      ...(imagePreview && { imagePreview }),
      ...(authorId && { authorId }),
    },
    true,
  );

  reply.status(200);
  return {
    book: updatedBook,
  };
}

/**
 * Delete book info by id.
 *
 * @param {FastifyRequest<{Params: {id: string;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ message: string; book?: IBook }>} Returns deleted book info or throws error if book not found.
 */
export async function deleteBookInfoController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ message: string; book?: IBook }> {
  const { id } = request.params;

  const existingBooks = await getBookInfoById(id, true);

  if (!existingBooks) {
    reply.status(404);
    throw new Error('Book not found');
  }

  const deletedBook = await deleteBookById(id, true);

  reply.status(200);
  return {
    message: 'Deleted',
    book: deletedBook,
  };
}

/**
 * Search books match using search query.
 *
 * @param {FastifyRequest<{Querystring: {search: string;limit?: number;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ books: IBook[] }>} Returns list of books that match search query.
 */
export async function searchBooksMatchController(
  request: FastifyRequest<{
    Querystring: {
      search: string;
      limit?: number;
    };
  }>,
  reply: FastifyReply,
): Promise<{ books: IBook[] }> {
  const { search, limit } = request.query;

  const currentDate = getNowDateInISOString();

  const booksList = await db
    .select({
      id: books.id,
    })
    .from(books)
    .where(
      and(
        eq(books.deletedAt, null),
        ilike(books.title, `%${search}%`),
        or(isNull(books.deletedAt), gt(books.deletedAt, currentDate)),
      ),
    )
    .orderBy(desc(books.createdAt))
    .limit(isNumber(limit) && limit > 10 ? limit : 10);

  const booksEnriched = await Promise.all(
    booksList.map(async (book) => {
      const bookInfo = await getBookInfoById(book.id, true);
      return bookInfo;
    }),
  );

  reply.status(200);
  return {
    books: booksEnriched,
  };
}
