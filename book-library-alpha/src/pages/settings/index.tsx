import { Button, Modal } from 'antd';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { Dialogs } from '@/types';
import { PlusCircleFilled } from '@ant-design/icons';
import { useScroll } from '@/hooks';
import { useEffect } from 'react';

import Header from '@/common/header';
import UpdateOrCreateBookDialog from '@/dialog/update-create-book';
import CreateAuthorDialog from '@/dialog/create-author';

const SettingsPage = () => {
  const { showDialog, isUpdatingOrSubmittingBook, setShowDialog } = useAppStore(
    useShallow((state) => ({
      showDialog: state.showDialog,
      isUpdatingOrSubmittingBook: state.isUpdatingOrSubmittingBook,
      setShowDialog: state.setShowDialog,
    })),
  );

  const { scrollUp } = useScroll();

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

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
                onClick={() => setShowDialog(Dialogs.updateOrCreateBook)}
              >
                New Book
                <PlusCircleFilled />
              </Button>
              <Button
                type="primary"
                className="w-full mt-4"
                onClick={() => setShowDialog(Dialogs.createAuthor)}
              >
                New Author <PlusCircleFilled />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={
          showDialog === Dialogs.updateOrCreateBook ||
          showDialog === Dialogs.createAuthor
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
        {showDialog === Dialogs.createAuthor && <CreateAuthorDialog />}
      </Modal>
    </>
  );
};

export default SettingsPage;
