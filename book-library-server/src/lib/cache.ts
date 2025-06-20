import { getAuthorById, getBookInfoById } from '@/helpers';
import { IAuthor, IBookWithAuthor } from '@/types';

/**
 * Introduces in-memory caching for books and authors.
 */
class Cache {
  public booksWithAuthors: Record<string, IBookWithAuthor> = {};

  public authors: Record<string, IAuthor> = {};

  /**
   * Get a book with its author by its ID.
   *
   * @param {string} id - The ID of the book to retrieve.
   * @param {boolean} refresh - Whether to refresh the cache.
   * @returns {Promise<IBookWithAuthor | null>} The book with its author if found, null otherwise.
   */
  getBookWithAuthorById = async (
    id: string,
    refresh?: boolean,
  ): Promise<IBookWithAuthor | null> => {
    const cached = this.booksWithAuthors[id];

    if (!cached || refresh) {
      const book = await getBookInfoById(id);
      const author = await this.getAuthorById(book?.authorId);

      if (!book) {
        return null;
      }

      const updatedCache: IBookWithAuthor = {
        ...book,
        author,
      };

      this.booksWithAuthors[id] = { ...updatedCache };

      return { ...updatedCache };
    }

    return cached;
  };

  /**
   * Get an author by its ID.
   *
   * @param {string} id - The ID of the author to retrieve.
   * @param {boolean} refresh - Whether to refresh the cache.
   * @returns {Promise<IAuthor | null>} The author if found, null otherwise.
   */
  getAuthorById = async (
    id: string,
    refresh?: boolean,
  ): Promise<IAuthor | null> => {
    const cached = this.authors[id];

    if (!cached || refresh) {
      const author = await getAuthorById(id);

      if (!author) {
        return null;
      }

      this.authors[id] = { ...author };

      return { ...author };
    }

    return cached;
  };

  /**
   * Set an author in the cache.
   *
   * @param {string} id - The ID of the author to set.
   * @param {IAuthor} author - The author to set in the cache.
   */
  setAuthorData = (id: string, author: IAuthor) => {
    this.authors[id] = { ...author };
  };

  /**
   * Set a book in the cache.
   *
   * @param {string} id - The ID of the book to set.
   * @param {IBookWithAuthor} book - The book to set in the cache.
   */
  setBookData = (id: string, book: IBookWithAuthor) => {
    this.booksWithAuthors[id] = { ...book };
  };
}

const cache = new Cache();

export { cache as Cache };
