import { isEmpty } from 'lodash';
import type { IBook } from '../../types';
import { Image, Card } from 'antd';

const { Meta } = Card;

const BookCard = (props: { book: IBook }) => {
  const { book } = props;

  return (
    <div className="relative w-[240px] box-border flex flex-col justify-start items-center">
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
                <p className="relative text-lg text-center mt-4">No Preview</p>
              </div>
            )}
          </>
        }
      >
        <Meta
          title={book?.title}
          description={book?.shortSummary}
          style={{
            maxHeight: 330,
          }}
        />
      </Card>
    </div>
  );
};

export default BookCard;
