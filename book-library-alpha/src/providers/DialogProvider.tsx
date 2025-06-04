import { Modal } from 'antd';
import { type ReactNode } from 'react';
import { Dialogs } from '../types';
import { useAppStore } from '../store';
import { useShallow } from 'zustand/shallow';

import UpdateOrCreateBookDialog from '../dialog/update-create-book';
import CreateAuthorDialog from '../dialog/create-author';

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const { showDialog, isUpdatingOrSubmittingBook, setShowDialog } = useAppStore(
    useShallow((state) => ({
      showDialog: state.showDialog,
      isUpdatingOrSubmittingBook: state.isUpdatingOrSubmittingBook,
      setShowDialog: state.setShowDialog,
    })),
  );

  return (
    <>
      {children}
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

export default DialogProvider;
