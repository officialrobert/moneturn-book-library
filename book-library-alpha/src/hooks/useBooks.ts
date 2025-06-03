import { useQuery } from '@tanstack/react-query';
import { useBooksStore } from '../store';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';
import { filter } from 'lodash';
import { useParams, useSearchParams } from 'react-router';
import { getBookInfoByIdApi, getBooksListByPageApi } from '../apis';

const useBooks = () => {
  const { booksListCurrentPage } = useBooksStore(
    useShallow((state) => ({
      booksListCurrentPage: state.booksListCurrentPage,
    })),
  );

  const urlParams = useParams();

  const [searchParams] = useSearchParams();

  const editBookId = useMemo(
    () => searchParams?.get('edit') || '',
    [searchParams],
  );

  const bookId = useMemo(() => urlParams?.id || '', [urlParams]);

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
    queryKey: ['bookInfo', bookId, editBookId],
    queryFn: () => getBookInfoByIdApi(editBookId ? editBookId : bookId),
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
    editBookId,
    isFetchingBookInfo,
    errorFetchingBookInfo,
  };
};

export { useBooks };
