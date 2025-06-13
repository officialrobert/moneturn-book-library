import { Button, Modal } from 'antd';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { Dialogs } from '@/types';
import { ArrowRightOutlined, PlusCircleFilled } from '@ant-design/icons';
import { useScroll } from '@/hooks';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import Header from '@/common/header';
import UpdateOrCreateBookDialog from '@/dialog/update-create-book';
import UpdateOrCreateAuthorDialog from '@/dialog/update-create-author';

const SettingsPage = () => {
  const { showDialog, isUpdatingOrSubmittingBook, setShowDialog } = useAppStore(
    useShallow((state) => ({
      showDialog: state.showDialog,
      isUpdatingOrSubmittingBook: state.isUpdatingOrSubmittingBook,
      setShowDialog: state.setShowDialog,
    })),
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const { scrollUp } = useScroll();

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  const handleNewAuthor = () => {
    searchParams.delete('edit');
    searchParams.delete('editAuthorId');
    setSearchParams(searchParams);
    setShowDialog(Dialogs.updateOrCreateAuthor);
  };

  const handleNewBook = () => {
    searchParams.delete('edit');
    searchParams.delete('editBookId');
    setSearchParams(searchParams);
    setShowDialog(Dialogs.updateOrCreateBook);
  };

  const handleAuthorsList = () => {
    setShowDialog(Dialogs.authorsList);
  };

  return (
    <>
      <div className="relative w-full box-border min-h-[100vh] mb-[100px]">
        <Header />

        <div className="relative w-full flex justify-center item-start mt-[300px]">
          <div className="relative w-full flex flex-col items-center justify-start lg:max-w-[1024px] md:max-w-[768px]">
            <div className="relative min-h-[200px] w-[300px] border-[1px] border-[var(--foreground)] p-6 rounded-md rounded-[4px]">
              <Button
                type="primary"
                className="w-full flex"
                onClick={handleNewBook}
              >
                New Book
                <PlusCircleFilled />
              </Button>
              <Button
                type="primary"
                className="w-full mt-4"
                onClick={handleNewAuthor}
              >
                New Author <PlusCircleFilled />
              </Button>
              <Button
                type="primary"
                className="w-full mt-4"
                onClick={handleAuthorsList}
              >
                Authors List <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={
          showDialog === Dialogs.updateOrCreateBook ||
          showDialog === Dialogs.updateOrCreateAuthor
        }
        closable
        maskClosable={false}
        onCancel={() => {
          if (isUpdatingOrSubmittingBook) {
            return;
          }

          setShowDialog(Dialogs.none);
        }}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {showDialog === Dialogs.updateOrCreateBook && (
          <UpdateOrCreateBookDialog />
        )}
        {showDialog === Dialogs.updateOrCreateAuthor && (
          <UpdateOrCreateAuthorDialog />
        )}
      </Modal>
    </>
  );
};

export default SettingsPage;
