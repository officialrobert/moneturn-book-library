import { create } from 'zustand';
import {
  type IBooksStore,
  type IAppStore,
  SupportedThemes,
  Dialogs,
  type IAuthorStore,
} from '@/types';

export const useBooksStore = create<IBooksStore>((set) => ({
  booksListCurrentPage: 1,

  setBooksListCurrentPage: (booksListCurrentPage: number) =>
    set({ booksListCurrentPage }),

  searchBooksListCurrentPage: 1,

  setSearchBooksListCurrentPage: (searchBooksListCurrentPage: number) =>
    set({ searchBooksListCurrentPage }),
}));

export const useAuthorStore = create<IAuthorStore>((set) => ({
  authorListCurrentPage: 1,

  setAuthorListCurrentPage: (authorListCurrentPage: number) =>
    set({ authorListCurrentPage }),
}));

export const useAppStore = create<IAppStore>((set) => ({
  theme: SupportedThemes.Light,
  showDialog: Dialogs.none,
  isUpdatingOrSubmittingBook: false,
  isUpdatingOrSubmittingAuthor: false,

  setTheme: (theme: SupportedThemes) => set({ theme }),
  setShowDialog: (showDialog: Dialogs) => set({ showDialog }),
  setIsUpdatingOrSubmittingBook: (isUpdatingOrSubmittingBook: boolean) =>
    set({ isUpdatingOrSubmittingBook }),
  setIsUpdatingOrSubmittingAuthor: (isUpdatingOrSubmittingAuthor: boolean) =>
    set({ isUpdatingOrSubmittingAuthor }),
}));
