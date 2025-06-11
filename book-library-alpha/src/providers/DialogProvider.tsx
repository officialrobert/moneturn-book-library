import { Modal } from 'antd';
import { useMemo, type ReactNode } from 'react';
import { Dialogs } from '@/types';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import UpdateOrCreateBookDialog from '@/dialog/update-create-book';
import CreateAuthorDialog from '@/dialog/create-author';
import DeleteBookDialog from '@/dialog/delete-book';

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const {
    showDialog,
    isUpdatingOrSubmittingBook,
    isUpdatingOrSubmittingAuthor,
    setShowDialog,
  } = useAppStore(
    useShallow((state) => ({
      showDialog: state.showDialog,
      isUpdatingOrSubmittingBook: state.isUpdatingOrSubmittingBook,
      isUpdatingOrSubmittingAuthor: state.isUpdatingOrSubmittingAuthor,
      setShowDialog: state.setShowDialog,
    })),
  );

  const isOpen = useMemo(() => {
    return (
      showDialog === Dialogs.updateOrCreateBook ||
      showDialog === Dialogs.createAuthor ||
      showDialog === Dialogs.deleteBook
    );
  }, [showDialog]);

  return (
    <>
      {children}

      <Modal
        open={isOpen}
        closable
        maskClosable={false}
        onCancel={() => {
          if (isUpdatingOrSubmittingBook || isUpdatingOrSubmittingAuthor) {
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
        {showDialog === Dialogs.deleteBook && <DeleteBookDialog />}
      </Modal>
    </>
  );
};

export default DialogProvider;
