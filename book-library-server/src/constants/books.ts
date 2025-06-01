import { IBook } from '@/types';

export const initialBooksData: IBook[] = [
  {
    id: '3889c9c8-7a12-40e9-8f84-29c9ecb93495',
    title: "Harry Potter and the Philosopher's Stone",
    shortSummary:
      "The Philosopher's Stone is a fantasy novel written by British author J.K. Rowling and the first in the Harry Potter series. The book was first published in 1997 and has since become a global phenomenon, selling over 500 million copies worldwide and being translated into 80 languages.",
    imagePreview: '/harry-potter-and-the-philosophers-stone.jpg',
    authorId: '229d1271-cc44-45ef-a742-d4ebca43db66',
    createdAt: '2025-05-30T14:14:59.051Z',
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: '3d5dcd3c-3fb5-4aa7-b2ea-1af0a4531745',
    title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
    shortSummary:
      'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe is a fantasy novel written by British author C.S. Lewis and the first in the Chronicles of Narnia series. The book was first published in 1950 and has since become a global phenomenon, selling over 100 million copies worldwide and being translated into 80 languages.',
    imagePreview:
      '/the-chronicles-of-narnia-the-lion-the-witch-and-the-wardrobe.jpg',
    authorId: '0108cfc4-83a4-4678-ab5b-da52f2f9e3bf',
    createdAt: '2025-05-30T14:18:18.106Z',
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: 'd0aa7c55-79a3-46d2-b94e-5d3ee26951f8',
    authorId: '9270e63d-89ae-4d60-992a-5224265d2456',
    title: 'The Shining',
    shortSummary:
      'The Shining is a horror novel written by American author Stephen King and the first in the Shining series. The book was first published in 1977 and has since become a global phenomenon, selling over 500 million copies worldwide and being translated into 80 languages.',
    imagePreview: '/the-shining.jpg',
    createdAt: '2025-05-30T14:19:30.570Z',
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: '7f3df1d6-9ad3-4170-a690-2a793bfb06c0',
    authorId: 'fd015f84-abc2-44f0-8c92-61549691a15f',
    title: 'The Da Vinci Code',
    shortSummary:
      'The Da Vinci Code is a mystery novel written by American author Dan Brown and the first in the Da Vinci Code series. The book was first published in 2003 and has since become a global phenomenon, selling over 500 million copies worldwide and being translated into 80 languages.',
    imagePreview: '/the-da-vinci-code.jpg',
    createdAt: '2025-05-30T14:19:30.570Z',
    updatedAt: null,
    deletedAt: null,
  },
];
