import { isEmpty } from 'lodash';
import { Dialogs, type IBookWithAuthor } from '../../types';
import { Image, Card, Button } from 'antd';
import { Link, useSearchParams } from 'react-router';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/shallow';

const { Meta } = Card;

const BookCard = (props: { book: IBookWithAuthor }) => {
  const { book } = props;
  const { setShowDialog } = useAppStore(
    useShallow((state) => ({
      setShowDialog: state.setShowDialog,
    })),
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const handleEdit = () => {
    if (!book?.id) {
      return;
    }

    searchParams.set('edit', book?.id);
    setSearchParams(searchParams);
    setShowDialog(Dialogs.updateOrCreateBook);
  };

  const handleDelete = () => {
    if (!book?.id) {
      return;
    }

    searchParams.set('delete', book?.id);
    setSearchParams(searchParams);
    setShowDialog(Dialogs.deleteBook);
  };

  return (
    <div className="relative w-[240px] box-border flex flex-col justify-start items-center">
      <Card
        hoverable
        style={{ width: 240, height: 710 }}
        cover={
          <>
            {!isEmpty(book?.imagePreview) && (
              <div className="relative h-[260px] w-[240px] overflow-hidden flex justify-center items-center">
                <Image
                  src={book?.imagePreview}
                  style={{
                    height: '260px',
                    width: '240px',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    marginTop: '2px',
                  }}
                />
              </div>
            )}
            {isEmpty(book?.imagePreview) && (
              <div className="h-[260px] w-[240px] box-border flex justify-center items-center">
                <p className="relative text-md text-center mt-4">No Preview</p>
              </div>
            )}

            <div className="relative w-full flex flex-wrap justify-center items-center">
              <p className="text-md text-center mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {book?.author?.name}
              </p>
            </div>
          </>
        }
        actions={[
          <Button
            key="edit"
            type="text"
            className="relative flex"
            onClick={() => handleEdit()}
          >
            <EditOutlined />
          </Button>,
          <Button
            key="delete"
            type="text"
            className="relative flex"
            onClick={() => handleDelete()}
          >
            <DeleteOutlined />
          </Button>,
        ]}
      >
        <Link to={`/book/${book?.id}`}>
          <Meta
            title={book?.title}
            description={book?.shortSummary}
            style={{
              height: 300,
            }}
          />
        </Link>
      </Card>
    </div>
  );
};

export default BookCard;
