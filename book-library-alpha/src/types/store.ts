export interface IBooksStore {
  booksListCurrentPage: number;

  setBooksListCurrentPage: (page: number) => void;

  searchBooksListCurrentPage: number;

  setSearchBooksListCurrentPage: (page: number) => void;
}

export enum SupportedThemes {
  Dark = 'dark',
  Light = 'light',
}

export interface IAppStore {
  theme: SupportedThemes;

  setTheme: (theme: SupportedThemes) => void;
}
