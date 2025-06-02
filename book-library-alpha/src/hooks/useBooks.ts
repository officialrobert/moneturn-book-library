import { useQuery } from '@tanstack/react-query';
import { useBooksStore } from '../store';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';
import { filter } from 'lodash';
import { useParams } from 'react-router';
import { getBookInfoByIdApi, getBooksListByPageApi } from '../apis';

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
    queryFn: () => getBooksListByPageApi({ page: booksListCurrentPage }),
  });

  const {
    data: book,
    isLoading: isFetchingBookInfo,
    error: errorFetchingBookInfo,
  } = useQuery({
    queryKey: ['bookInfo', id],
    queryFn: () => getBookInfoByIdApi(id || ''),
  });

  const books = useMemo(
    () => filter(booksListMetadata?.books || [], (item) => !!item?.id),
    [booksListMetadata],
  );

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
