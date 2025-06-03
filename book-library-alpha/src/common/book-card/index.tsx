import { isEmpty } from 'lodash';
import type { IBookWithAuthor } from '../../types';
import { Image, Card } from 'antd';
import { Link } from 'react-router';

const { Meta } = Card;

const BookCard = (props: { book: IBookWithAuthor }) => {
  const { book } = props;

  return (
    <div className="relative w-[240px] box-border flex flex-col justify-start items-center">
      <Link to={`/book/${book?.id}`}>
        <Card
          hoverable
          style={{ width: 240, height: 630 }}
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
                  <p className="relative text-md text-center mt-4">
                    No Preview
                  </p>
                </div>
              )}

              <div className="relative w-full flex flex-wrap justify-center items-center">
                <p className="text-md text-center mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {book?.author?.name}
                </p>
              </div>
            </>
          }
        >
          <Meta
            title={book?.title}
            description={book?.shortSummary}
            style={{
              maxHeight: 320,
            }}
          />
        </Card>
      </Link>
    </div>
  );
};

export default BookCard;
