import { useSearchParams } from 'react-router';
import { useBooks, useDialog } from '../../hooks';
import { useMemo, useState } from 'react';
import { Button } from 'antd';
import { deleteBookByIdApi } from '../../apis';

const DeleteBookDialog = () => {
  const [searchParams] = useSearchParams();

  const deleteBookId = searchParams.get('delete');

  const { books, fetchBooksList } = useBooks();

  const { closeDialog } = useDialog();

  const [inProgress, setInProgress] = useState(false);

  const book = useMemo(() => {
    return books.find((book) => book.id === deleteBookId);
  }, [books, deleteBookId]);

  const handleDeleteBook = async () => {
    if (!deleteBookId) {
      return;
    }

    try {
      setInProgress(true);

      await deleteBookByIdApi(deleteBookId);
      await fetchBooksList();
    } catch (e) {
      console.log(e);
    } finally {
      setInProgress(false);
      closeDialog();
    }
  };

  return (
    <div className="relative w-full box-border flex flex-col mt-8">
      <h1 className="text-center text-lg">{`Are you sure you want to delete "${book?.title}"?`}</h1>

      <div className="relative flex justify-end items-center mt-4">
        <Button
          variant="solid"
          type="primary"
          onClick={() => handleDeleteBook()}
          loading={inProgress}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default DeleteBookDialog;
