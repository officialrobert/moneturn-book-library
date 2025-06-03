export interface IBooksStore {
  booksListCurrentPage: number;

  setBooksListCurrentPage: (page: number) => void;

  searchBooksListCurrentPage: number;

  setSearchBooksListCurrentPage: (page: number) => void;
}

export interface IAuthorStore {
  authorListCurrentPage: number;

  setAuthorListCurrentPage: (page: number) => void;
}

export enum SupportedThemes {
  Dark = 'dark',
  Light = 'light',
}

export enum Dialogs {
  'updateOrCreateBook' = 'updateOrCreateBook',
  'createAuthor' = 'createAuthor',
  'none' = 'none',
}

export interface IAppStore {
  theme: SupportedThemes;
  showDialog: Dialogs;
  isUpdatingOrSubmittingBook: boolean;
  isUpdatingOrSubmittingAuthor: boolean;

  setTheme: (theme: SupportedThemes) => void;
  setShowDialog: (dialog: Dialogs) => void;
  setIsUpdatingOrSubmittingBook: (submitting: boolean) => void;
  setIsUpdatingOrSubmittingAuthor: (submitting: boolean) => void;
}
