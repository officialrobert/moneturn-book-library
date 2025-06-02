import { db, books } from '@/db';
import { head, isEmpty, map, omit } from 'lodash';
import { IBook } from '@/types';
import { eq } from 'drizzle-orm';
import { formatBookImagePreviewProperty } from '../books';
import { NewBooksQueue } from '@/lib';
import { v4 as uuid } from 'uuid';

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
