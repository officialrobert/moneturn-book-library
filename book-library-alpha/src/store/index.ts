import { create } from 'zustand';
import { type IBooksStore, type IAppStore, SupportedThemes } from '../types';

export const useBooksStore = create<IBooksStore>((set) => ({
  booksListCurrentPage: 1,

  setBooksListCurrentPage: (booksListCurrentPage: number) =>
    set({ booksListCurrentPage }),

  searchBooksListCurrentPage: 1,

  setSearchBooksListCurrentPage: (searchBooksListCurrentPage: number) =>
    set({ searchBooksListCurrentPage }),
}));

export const useAppStore = create<IAppStore>((set) => ({
  theme: SupportedThemes.Light,

  setTheme: (theme: SupportedThemes) => set({ theme }),
}));
