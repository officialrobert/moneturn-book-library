import { IAuthor } from '@/types';
import { db, authors } from '@/db';
import { eq } from 'drizzle-orm';
import { head, isEmpty, map, omit } from 'lodash';
import { v4 as uuid } from 'uuid';

/**
 * Creates a new author in the database.
 *
 * @param {IAuthor} author - The author object to create.
 * @param {string} author.id - The ID of the author to create.
 * @param {string} author.name - The name of the author to create.
 * @param {string} author.bio - The bio of the author to create.
 * @param {string} author.createdAt - The creation date of the author to create.
 * @param {string} author.updatedAt - The update date of the author to create.
 * @param {string | null} author.deletedAt - The deletion date of the author to create.
 * @returns {Promise<IAuthor | null>} The created author if successful, null otherwise.
 */
export async function createNewAuthor(
  author: IAuthor,
): Promise<IAuthor | null> {
  try {
    const id = author?.id || uuid();
    const newAuthor = await db
      .insert(authors)
      .values({
        id,
        name: author.name,
        bio: author.bio,
        createdAt: new Date(author.createdAt),
        updatedAt: author.updatedAt ? new Date(author.updatedAt) : null,
        deletedAt: author.deletedAt ? new Date(author.deletedAt) : null,
      })
      .returning();

    return head(newAuthor) as unknown as IAuthor;
  } catch (err) {
    console.log('createNewAuthor() err:', err);
    return null;
  }
}

/**
 * Get an author's information by their ID.
 *
 * @param {string} id - The ID of the author to retrieve.
 * @returns {Promise<IAuthor | null>} The author's information if found, null otherwise.
 */
export async function getAuthorById(id: string): Promise<IAuthor | null> {
  try {
    const authorsList = await db
      .select({
        id: authors.id,
        name: authors.name,
        bio: authors.bio,
        createdAt: authors.createdAt,
        updatedAt: authors.updatedAt,
        deletedAt: authors.deletedAt,
      })
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);

    const author = head(
      map(authorsList, (author) => ({
        id: author.id,
        name: author.name,
        bio: author.bio,
        createdAt: author.createdAt ? author.createdAt.toISOString() : null,
        updatedAt: author.updatedAt ? author.updatedAt.toISOString() : null,
        deletedAt: author.deletedAt ? author.deletedAt.toISOString() : null,
      })),
    );

    return author;
  } catch (err) {
    console.log('getAuthorById() err:', err);
    return null;
  }
}

/**
 * Updates an author's properties by their ID.
 *
 * @param {string} id - The ID of the author to update.
 * @param {Partial<IAuthor>} props - The properties to update.
 * @param {string} props.name - The name of the author to update.
 * @param {string} props.bio - The bio of the author to update.
 * @param {string} props.updatedAt - The update date of the author to update.
 * @param {string} props.deletedAt - The deletion date of the author to update.
 * @returns {Promise<IAuthor | null>} The updated author if successful, null otherwise.
 */
export async function updateAuthorPropsById(
  id: string,
  props: Partial<IAuthor>,
): Promise<IAuthor | null> {
  try {
    const updatedAuthorsList = await db
      .update(authors)
      .set({
        ...omit(props, ['id', 'createdAt', 'deletedAt']),
        updatedAt: new Date(),
        ...(!isEmpty(props.deletedAt) && {
          deletedAt: new Date(props.deletedAt),
        }),
      })
      .where(eq(authors.id, id))
      .returning();

    const updatedAuthor = head(
      map(updatedAuthorsList, (author) => ({
        id: author.id,
        name: author.name,
        bio: author.bio,
        createdAt: author.createdAt ? author.createdAt.toISOString() : null,
        updatedAt: author.updatedAt ? author.updatedAt.toISOString() : null,
        deletedAt: author.deletedAt ? author.deletedAt.toISOString() : null,
      })),
    );

    return updatedAuthor as IAuthor;
  } catch (err) {
    console.log('updateAuthorPropsById() err:', err);
    return null;
  }
}

/**
 * Soft delete an author by their ID.
 *
 * @param {string} id - The ID of the author to delete.
 * @returns {Promise<IAuthor | null>} The deleted author if successful, null otherwise.
 */
export async function deleteAuthorById(id: string): Promise<IAuthor | null> {
  try {
    const deletedAuthorsList = await db
      .update(authors)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(authors.id, id))
      .returning();
    const deletedAuthor = head(
      map(deletedAuthorsList, (author) => ({
        id: author.id,
        name: author.name,
        bio: author.bio,
        createdAt: author.createdAt ? author.createdAt.toISOString() : null,
        updatedAt: author.updatedAt ? author.updatedAt.toISOString() : null,
        deletedAt: author.deletedAt ? author.deletedAt.toISOString() : null,
      })),
    );

    return deletedAuthor as IAuthor;
  } catch (err) {
    console.log('deleteAuthorById() err:', err);
    return null;
  }
}
