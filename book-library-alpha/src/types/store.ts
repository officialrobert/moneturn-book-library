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
  'createBook' = 'createBook',
  'createAuthor' = 'createAuthor',
  'none' = 'none',
}

export interface IAppStore {
  theme: SupportedThemes;
  showDialog: Dialogs;
  submittingNewBook: boolean;

  setTheme: (theme: SupportedThemes) => void;
  setShowDialog: (dialog: Dialogs) => void;
  setSubmittingNewBook: (submitting: boolean) => void;
}
