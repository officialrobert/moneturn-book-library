import { useQuery } from '@tanstack/react-query';
import { useBooksStore } from '../store';
import { useShallow } from 'zustand/shallow';
import { getServerApiBaseUrl } from '../helpers';
import { useMemo } from 'react';
import { filter } from 'lodash';
import type { IBook, IPagination } from '../types';
import { useParams } from 'react-router';

import axios from 'axios';

const useBooks = () => {
  const { booksListCurrentPage } = useBooksStore(
    useShallow((state) => ({
      booksListCurrentPage: state.booksListCurrentPage,
    })),
  );

  const { id } = useParams();

  const {
    data: booksListMetadata,
    isLoading: isFetchingBooksList,
    error: errorFetchingBooksList,
  } = useQuery({
    queryKey: ['booksList', booksListCurrentPage],
    queryFn: async () => {
      const res = await axios.get<{ books: IBook[]; pagination: IPagination }>(
        `${getServerApiBaseUrl()}/books/list?page=${booksListCurrentPage}&limit=10`,
      );

      return res.data;
    },
  });

  const {
    data: bookInfo,
    isLoading: isFetchingBookInfo,
    error: errorFetchingBookInfo,
  } = useQuery({
    queryKey: ['bookInfo', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Book id is required');
      }

      const res = await axios.get<{ book: IBook }>(
        `${getServerApiBaseUrl()}/books/${id}`,
      );
      return res.data;
    },
  });

  const books = useMemo(
    () => filter(booksListMetadata?.books || [], (item) => !!item?.id),
    [booksListMetadata],
  );

  const book = useMemo(() => bookInfo?.book || null, [bookInfo]);

  return {
    books,
    isFetchingBooksList,
    errorFetchingBooksList,
    book,
    isFetchingBookInfo,
    errorFetchingBookInfo,
  };
};

export { useBooks };
