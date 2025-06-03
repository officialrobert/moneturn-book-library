import { getServerApiBaseUrl } from '../helpers';
import type { IBook, IBookWithAuthor, IPagination } from '../types';
import axios from 'axios';

/**
 * Triggers the creation of a new book.
 *
 * @param {Object} params - The parameters for creating a new book.
 * @param {string} params.title - The title of the book.
 * @param {string} params.shortSummary - The short summary of the book.
 * @param {string} params.imagePreview - The image preview of the book.
 * @param {string} params.authorId - The author ID of the book.
 * @returns {Promise<IBook | undefined>} The created book or undefined if the request fails.
 */
export async function createNewBookInfoApi(params: {
  title: string;
  shortSummary: string;
  imagePreview: string;
  authorId: string;
}): Promise<IBook | undefined> {
  const { title, shortSummary, imagePreview, authorId } = params;
  const url = getServerApiBaseUrl();
  const res = await axios.post<{ book: IBook }>(`${url}/books`, {
    title,
    shortSummary,
    imagePreview,
    authorId,
  });

  return res?.data?.book;
}

/**
 * Search for books based on the provided search query.
 *
 * @param {Object} params - The parameters for searching books.
 * @param {string} params.search - The search query.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of books per page.
 * @returns {Promise<{ books: IBookWithAuthor[]; pagination: IPagination }>} The search results.
 */
export async function searchForBooksApi(params: {
  search: string;
  page?: number;
  limit?: number;
}): Promise<{ books: IBookWithAuthor[]; pagination: IPagination }> {
  const { search, page = 1, limit } = params;
  const url = getServerApiBaseUrl();

  const searchParams = new URLSearchParams({
    search,
    page: page.toString(),
    limit: limit?.toString() || '10',
  });

  const res = await axios.get<{
    books: IBookWithAuthor[];
    pagination: IPagination;
  }>(`${url}/books/search?${searchParams.toString()}`);

  return res?.data;
}

/**
 * Get books list by page.
 *
 * @param {Object} params - The parameters for getting books list.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of books per page.
 * @returns {Promise<{ books: IBookWithAuthor[]; pagination: IPagination }>}
 * The books list and pagination information.
 */
export async function getBooksListByPageApi(params: {
  page: number;
  limit?: number;
}): Promise<{ books: IBookWithAuthor[]; pagination: IPagination }> {
  const { page, limit = 10 } = params;

  const url = getServerApiBaseUrl();

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit?.toString() || '10',
  });

  const res = await axios.get<{
    books: IBookWithAuthor[];
    pagination: IPagination;
  }>(`${url}/books/list?${searchParams.toString()}`);

  return res?.data;
}

/**
 * Get book info by id.
 *
 * @param {string} id - The book id.
 * @returns {Promise<IBookWithAuthor | undefined>} The book info.
 */
export async function getBookInfoByIdApi(
  id: string,
): Promise<IBookWithAuthor | undefined> {
  if (!id) {
    throw new Error('Book id is required');
  }

  const url = getServerApiBaseUrl();

  const res = await axios.get<{ book: IBookWithAuthor }>(`${url}/books/${id}`);

  return res?.data?.book;
}

/**
 * Update book info by id.
 *
 * @param {Object} params - The parameters for updating a book.
 * @param {string} params.id - The book id.
 * @param {string} params.title - The title of the book.
 * @param {string} params.shortSummary - The short summary of the book.
 * @param {string} params.imagePreview - The image preview of the book.
 * @param {string} params.authorId - The author ID of the book.
 * @returns {Promise<IBookWithAuthor | undefined>} The updated book info.
 */
export async function updateBookInfoApi(params: {
  id: string;
  title?: string;
  shortSummary?: string;
  imagePreview?: string;
  authorId?: string;
}): Promise<IBookWithAuthor | undefined> {
  const { id, title, shortSummary, imagePreview, authorId } = params;

  const url = getServerApiBaseUrl();

  const res = await axios.patch<{ book: IBookWithAuthor }>(
    `${url}/books/${id}`,
    {
      title,
      shortSummary,
      imagePreview,
      authorId,
    },
  );

  return res?.data?.book;
}
