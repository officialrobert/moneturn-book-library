import { useBooks } from '../../hooks';
import { Input } from 'antd';
import { map } from 'lodash';

import Header from '../../common/header';
import BookCard from '../../common/book-card';

const DefaultPage = () => {
  const { books } = useBooks();

  return (
    <div className="relative w-full box-border min-h-[100vh] mb-[100px]">
      <Header />

      <div className="relative w-full flex justify-center item-start mt-[300px]">
        <div className="relative w-full flex flex-col items-center justify-start lg:max-w-[1024px] md:max-w-[768px]">
          <Input
            placeholder="Search"
            type="text"
            className="relative max-w-[300px] md:max-w-[500px] lg:w-[600px]"
            maxLength={40}
          />
          <div className="relative w-full mt-12">
            <ul className="relative flex flex-wrap justify-center items-start gap-4">
              {map(books, (book) => {
                const key = book?.id || '';

                return (
                  <li key={key} className="relative box-border">
                    <BookCard book={book} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
