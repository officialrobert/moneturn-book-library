export interface IAuthor {
  id: string;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface IBook {
  id: string;
  title: string;
  shortSummary: string;
  imagePreview: string;
  authorId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface INewBookSubmitForm {
  title: string;
  shortSummary: string;
  imagePreview: string;
  authorId: string | null;
}

export interface INewAuthorSubmitForm {
  name: string;
  bio: string;
}

export interface IBookWithAuthor extends IBook {
  author: IAuthor;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export * from './store';
