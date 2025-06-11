import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useAuthorStore } from '@/store';
import { getAuthorListByPageApi } from '@/apis';

const useAuthors = () => {
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

export { useAuthors };
