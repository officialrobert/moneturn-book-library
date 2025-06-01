import { Header } from 'antd/es/layout/layout';
import { useBooks } from '../../hooks';

const Book = () => {
  const { book } = useBooks();

  return (
    <div>
      <Header />
      Book {book?.title}
    </div>
  );
};

export default Book;
