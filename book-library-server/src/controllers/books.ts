import { FastifyReply, FastifyRequest } from 'fastify';
import { desc, and, sql, isNull, or, gt } from 'drizzle-orm';
import { db, books } from '@/db';
import { head, isNumber, toLower, trim } from 'lodash';
import { IBook, IBookWithAuthor, IPagination } from '@/types';
import {
  createNewBook,
  deleteBookById,
  getAuthorById,
  getBookInfoById,
  getBooksListByPage,
  getNowDateInISOString,
  searchBooksByMatchString,
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
      authorId: string;
      imagePreview?: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ book: IBook }> {
  const { title, shortSummary, imagePreview, authorId } = request.body;
  const bookId = uuid();
  const today = getNowDateInISOString();

  if (!title || !shortSummary || !authorId) {
    reply.status(400);
    throw new Error("'title', 'shortSummary', and 'authorId' are required");
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
 * @returns {Promise<{ book: IBookWithAuthor }>}
 */
export async function getBookByIdController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ book: IBookWithAuthor }> {
  const { id } = request.params;

  if (!id) {
    reply.status(400);
    throw new Error('Book id is required');
  }

  const bookInfo = await getBookInfoById(id);

  if (!bookInfo) {
    reply.status(404);
    throw new Error('Book not found');
  }

  const authorInfo = await getAuthorById(bookInfo.authorId);

  reply.status(200);
  return { book: { ...bookInfo, author: authorInfo } };
}

/**
 * Get books list by page.
 *
 * @param {FastifyRequest<{Querystring: {page: number;limit: number;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ books: IBookWithAuthor[]; pagination: IPagination }>}
 */
export async function getBooksByPageController(
  request: FastifyRequest<{
    Querystring: {
      page: number;
      limit: number;
    };
  }>,
  reply: FastifyReply,
): Promise<{ books: IBookWithAuthor[]; pagination: IPagination }> {
  const { page, limit } = request.query;

  const { pagination, books } = await getBooksListByPage({ page, limit });

  reply.status(200);
  return {
    pagination,
    books,
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
): Promise<{ book: IBookWithAuthor } | null> {
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

  const authorInfo = await getAuthorById(updatedBook.authorId);

  reply.status(200);
  return {
    book: {
      ...updatedBook,
      author: authorInfo,
    },
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
 * @param {FastifyRequest<{Querystring: {search: string;page?: number;limit?: number;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ books: IBookWithAuthor[]; pagination: IPagination }>} Returns list of books that match search query.
 */
export async function searchBooksMatchController(
  request: FastifyRequest<{
    Querystring: {
      search: string;
      page?: number;
      limit?: number;
    };
  }>,
  reply: FastifyReply,
): Promise<{ books: IBookWithAuthor[]; pagination: IPagination }> {
  const { search, page = 1, limit } = request.query;

  const { books, pagination } = await searchBooksByMatchString({
    search,
    page,
    limit,
  });

  reply.status(200);
  return {
    books,
    pagination,
  };
}
