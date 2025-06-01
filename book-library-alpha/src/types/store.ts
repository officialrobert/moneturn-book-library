export interface IBooksStore {
  booksListCurrentPage: number;

  setBooksListCurrentPage: (page: number) => void;

  searchBooksListCurrentPage: number;

  setSearchBooksListCurrentPage: (page: number) => void;
}
