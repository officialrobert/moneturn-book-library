import Header from '../../common/header';

import { useEffect } from 'react';
import { useBooks } from '../../hooks';

const Book = () => {
  const { book } = useBooks();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="relative w-full box-border min-h-[100vh] mb-[100px]">
      <Header />
      <div className="relative w-full flex justify-center item-start mt-[300px]">
        <div className="relative w-full flex flex-col items-center justify-start lg:max-w-[1024px] md:max-w-[768px]">
          <p className="text-2xl font-bold">{book?.title}</p>
          <p className="text-md text-center mt-2">{book?.shortSummary}</p>
        </div>
      </div>
    </div>
  );
};

export default Book;
