import { db, books } from '@/db';
import { head, isEmpty, isNumber, map, omit, toLower, trim } from 'lodash';
import { IBook, IBookWithAuthor, IPagination } from '@/types';
import { eq, and, desc, sql, isNull, or, gt } from 'drizzle-orm';
import { formatBookImagePreviewProperty } from '../books';
import { NewBooksQueue } from '@/lib';
import { v4 as uuid } from 'uuid';
import { getAuthorById } from './authors';
import { getNowDateInISOString } from '../date';

/**
 * Creates a new book in the database.
 *
 * @param {IBook} book - The book object to create.
 * @param {string} book.id - The ID of the book to create.
 * @param {string} book.title - The title of the book to create.
 * @param {string} book.shortSummary - The short summary of the book to create.
 * @param {string} book.imagePreview - The image preview of the book to create.
 * @param {string} book.authorId - The author ID of the book to create.
 * @returns {Promise<IBook | null>} The created book if successful, null otherwise.
 */
export async function createNewBook(book: IBook): Promise<IBook | null> {
  try {
    const id = book.id || uuid();

    await NewBooksQueue.add(async () => {
      const newBook = await db
        .insert(books)
        .values({
          id,
          title: book.title,
          shortSummary: book.shortSummary,
          imagePreview: book.imagePreview || null,
          authorId: book.authorId || null,
          createdAt: new Date(book.createdAt),
          updatedAt: book.updatedAt ? new Date(book.updatedAt) : null,
          deletedAt: book.deletedAt ? new Date(book.deletedAt) : null,
        })
        .returning();

      return head(newBook) as unknown as IBook;
    }, 'createBook');

    return { ...book, id, updatedAt: null, deletedAt: null };
  } catch (err) {
    console.log('createNewBook() err:', err);
    return null;
  }
}

/**
 * Get a book's information by its ID.
 *
 * @param {string} id - The ID of the book to retrieve.
 * @param {boolean} [throwErr=false] - Whether to throw an error if the book is not found.
 * @returns {Promise<IBook | null>} The book's information if found, null otherwise.
 */
export async function getBookInfoById(
  id: string,
  throwErr?: boolean,
): Promise<IBook | null> {
  try {
    const booksList = await db
      .select({
        id: books.id,
        title: books.title,
        shortSummary: books.shortSummary,
        imagePreview: books.imagePreview,
        authorId: books.authorId,
        createdAt: books.createdAt,
        updatedAt: books.updatedAt,
        deletedAt: books.deletedAt,
      })
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    const bookDateEnriched = head(
      map(booksList, (book) => ({
        ...book,
        imagePreview: formatBookImagePreviewProperty(book.imagePreview),
        createdAt: book.createdAt?.toISOString() || null,
        updatedAt: book.updatedAt?.toISOString() || null,
        deletedAt: book.deletedAt?.toISOString() || null,
      })),
    );

    return bookDateEnriched as unknown as IBook;
  } catch (err) {
    console.log('getBookInfoById() err:', err);

    if (throwErr) {
      throw err;
    }

    return null;
  }
}

/**
 * Update a book's properties by its ID.
 *
 * @param {string} id - The ID of the book to update.
 * @param {Partial<IBook>} props - The properties to update.
 * @param {string} props.title - The title of the book to update.
 * @param {string} props.shortSummary - The short summary of the book to update.
 * @param {string} props.imagePreview - The image preview of the book to update.
 * @param {string} props.authorId - The author ID of the book to update.
 * @param {string | null} props.deletedAt - The deletion date of the book to update.
 * @param {boolean} [throwErr=false] - Whether to throw an error if the update fails.
 * @returns {Promise<IBook | null>} The updated book if successful, null otherwise.
 */
export async function updateBookPropsById(
  id: string,
  props: Partial<IBook>,
  throwErr?: boolean,
): Promise<IBook | null> {
  try {
    const updatedBook = await db
      .update(books)
      .set({
        ...omit(props, ['id', 'createdAt', 'deletedAt']),
        updatedAt: new Date(),
        ...(!isEmpty(props?.deletedAt) && {
          deletedAt: new Date(props.deletedAt),
        }),
      })
      .where(eq(books.id, id))
      .returning();

    return head(updatedBook) as unknown as IBook;
  } catch (err) {
    console.log('updateBookPropsById() err:', err);

    if (throwErr) {
      throw err;
    }

    return null;
  }
}

/**
 * Soft delete a book by its ID.
 *
 * @param {string} id - The ID of the book to delete.
 * @param {boolean} [throwErr=false] - Whether to throw an error if the deletion fails.
 * @returns {Promise<IBook | null>} The deleted book if successful, null otherwise.
 */
export async function deleteBookById(
  id: string,
  throwErr?: boolean,
): Promise<IBook | null> {
  try {
    const deletedBook = await db
      .update(books)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(books.id, id))
      .returning();

    return head(deletedBook) as unknown as IBook;
  } catch (err) {
    console.log('deleteBookById() err:', err);

    if (throwErr) {
      throw err;
    }

    return null;
  }
}

/**
 * Get books list by page.
 *
 * @param {Object} params
 * @param {number} params.page - The page number.
 * @param {number} params.limit - The number of items per page.
 * @returns {Promise<{ books: IBookWithAuthor[]; pagination: IPagination }>} The books list and pagination information.
 */
export async function getBooksListByPage(params: {
  page: number;
  limit: number;
}): Promise<{ books: IBookWithAuthor[]; pagination: IPagination }> {
  const { page = 1, limit = 10 } = params;
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
      const authorInfo = await getAuthorById(bookInfo.authorId);

      return {
        ...bookInfo,
        author: authorInfo,
      };
    }),
  );

  const pagination: IPagination = {
    currentPage: page,
    totalPages: Math.ceil(Number(head(totalCount)?.count) / limit),
    totalItems: Number(head(totalCount)?.count),
    itemsPerPage: limit,
  };

  return {
    pagination,
    books: booksEnriched,
  };
}

/**
 * Search books by match string.
 *
 * @param {Object} params
 * @param {string} params.search - The search string.
 * @param {number} params.page - The page number.
 * @param {number} params.limit - The number of items per page. Default is 10.
 * @returns {Promise<{ books: IBookWithAuthor[]; pagination: IPagination }>} The books list and pagination information.
 */
export async function searchBooksByMatchString(params: {
  search: string;
  page?: number;
  limit?: number;
}): Promise<{ books: IBookWithAuthor[]; pagination: IPagination }> {
  const { search, page = 1, limit } = params;
  const normalizedSearch = toLower(trim(search));
  const currentDate = getNowDateInISOString();
  const targetLimit = isNumber(limit) && limit > 10 ? limit : 10;
  const [booksList, totalCount] = await Promise.all([
    db
      .select({
        id: books.id,
      })
      .from(books)
      .where(
        and(
          or(
            sql`LOWER(${books.title}) ILIKE ${`%${normalizedSearch}%`}`,
            sql`LOWER(${books.shortSummary}) ILIKE ${`%${normalizedSearch}%`}`,
          ),
          or(isNull(books.deletedAt), gt(books.deletedAt, currentDate)),
        ),
      )
      .orderBy(desc(books.createdAt))
      .limit(targetLimit)
      .offset((page - 1) * targetLimit),
    db
      .select({ count: sql`count(*)` })
      .from(books)
      .where(
        and(
          or(
            sql`LOWER(${books.title}) ILIKE ${`%${normalizedSearch}%`}`,
            sql`LOWER(${books.shortSummary}) ILIKE ${`%${normalizedSearch}%`}`,
          ),
          or(isNull(books.deletedAt), gt(books.deletedAt, currentDate)),
        ),
      ),
  ]);

  const booksEnriched = await Promise.all(
    booksList.map(async (book) => {
      const bookInfo = await getBookInfoById(book.id, true);
      const authorInfo = await getAuthorById(bookInfo.authorId);

      return {
        ...bookInfo,
        author: authorInfo,
      };
    }),
  );
  const totalPages = Math.ceil(Number(head(totalCount)?.count) / targetLimit);
  const pagination: IPagination = {
    currentPage: page,
    totalPages: isNumber(totalPages) && totalPages > 0 ? totalPages : 1,
    totalItems: Number(head(totalCount)?.count),
    itemsPerPage: targetLimit,
  };

  return {
    pagination,
    books: booksEnriched,
  };
}
