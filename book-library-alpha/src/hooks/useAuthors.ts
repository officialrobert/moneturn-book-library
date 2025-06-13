import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useAuthorStore } from '@/store';
import { getAuthorListByPageApi, getAuthorInfoByIdApi } from '@/apis';
import { useSearchParams } from 'react-router';

const useAuthors = () => {
  const { authorListCurrentPage } = useAuthorStore(
    useShallow((state) => ({
      authorListCurrentPage: state.authorListCurrentPage,
    })),
  );

  const [searchParams] = useSearchParams();

  const editAuthorId = useMemo(
    () => searchParams?.get('editAuthorId') || '',
    [searchParams],
  );

  const authorId = useMemo(
    () => searchParams?.get('authorId') || '',
    [searchParams],
  );

  const {
    data: authorsListData,
    isFetching: isFetchingAuthorsList,
    refetch: refetchAuthorsList,
  } = useQuery({
    queryKey: ['authorsList', authorListCurrentPage],
    queryFn: () => getAuthorListByPageApi({ page: authorListCurrentPage }),
  });

  const {
    data: authorData,
    isLoading: isFetchingAuthorInfo,
    error: errorFetchingAuthorInfo,
  } = useQuery({
    queryKey: ['authorInfo', editAuthorId],
    queryFn: () =>
      getAuthorInfoByIdApi({ id: editAuthorId ? editAuthorId : authorId }),
  });

  const author = useMemo(() => authorData?.author || null, [authorData]);

  const authorsList = useMemo(
    () => authorsListData?.authors || [],
    [authorsListData],
  );

  return {
    authorsList,
    author,
    editAuthorId,
    authorId,
    isFetchingAuthorInfo,
    errorFetchingAuthorInfo,
    isFetchingAuthorsList,
    refetchAuthorsList,
  };
};

export { useAuthors };
