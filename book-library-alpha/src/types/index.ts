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

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export * from './store';
