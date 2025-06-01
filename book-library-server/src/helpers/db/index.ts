import { initialAuthorsData, initialBooksData } from '@/constants';
import { createNewBook, getBookInfoById } from './books';
import { getNowDateInISOString } from '../date';
import { createNewAuthor, getAuthorById } from './authors';

export async function insertIfInitialDataForAuthorAndBooksNotPresent() {
  try {
    console.log('Checking and inserting initial data...');

    // Insert authors if they don't exist
    for (const author of initialAuthorsData) {
      const existingAuthor = await getAuthorById(author.id);

      if (!existingAuthor) {
        console.log(`Inserting author: ${author.name}`);
        await createNewAuthor({
          ...author,
          createdAt: getNowDateInISOString().toISOString(),
        });
      } else {
        console.log(`Author already exists: ${author.name}`);
      }
    }

    // Insert books if they don't exist
    for (const book of initialBooksData) {
      const existingBook = await getBookInfoById(book.id);

      if (!existingBook) {
        console.log(`Inserting book: ${book.title}`);
        await createNewBook({
          ...book,
          createdAt: getNowDateInISOString().toISOString(),
        });
      } else {
        console.log(`Book already exists: ${book.title}`);
      }
    }

    console.log('Initial data check/insert completed successfully');
  } catch (err) {
    console.error('Failed to check/insert initial data:', err);
  }
}

export * from './authors';
export * from './books';
