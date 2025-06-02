import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuthorStore } from '../store';
import { useShallow } from 'zustand/shallow';
import { getAuthorListByPageApi } from '../apis';

const useAuthor = () => {
  const { authorListCurrentPage } = useAuthorStore(
    useShallow((state) => ({
      authorListCurrentPage: state.authorListCurrentPage,
    })),
  );

  const { data } = useQuery({
    queryKey: ['authorsList', authorListCurrentPage],
    queryFn: () => getAuthorListByPageApi({ page: authorListCurrentPage }),
  });

  const authorsList = useMemo(() => data?.authors || [], [data]);

  return { authorsList };
};

export { useAuthor };
