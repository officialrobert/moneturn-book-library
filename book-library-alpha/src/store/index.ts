import { create } from 'zustand';
import type { IBooksStore } from '../types';

export const useBooksStore = create<IBooksStore>((set) => ({
  booksListCurrentPage: 1,

  setBooksListCurrentPage: (booksListCurrentPage: number) =>
    set({ booksListCurrentPage }),

  searchBooksListCurrentPage: 1,

  setSearchBooksListCurrentPage: (searchBooksListCurrentPage: number) =>
    set({ searchBooksListCurrentPage }),
}));
