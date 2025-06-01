import { useBooks } from '../../hooks';

import Header from '../../common/header';

const DefaultPage = () => {
  const { books } = useBooks();

  console.log('books', books);

  return (
    <div>
      <Header />
    </div>
  );
};

export default DefaultPage;
