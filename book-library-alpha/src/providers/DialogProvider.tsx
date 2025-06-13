import { Modal } from 'antd';
import { useMemo, type ReactNode } from 'react';
import { Dialogs } from '@/types';
import { useAppStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import UpdateOrCreateBookDialog from '@/dialog/update-create-book';
import DeleteBookDialog from '@/dialog/delete-book';
import UpdateOrCreateAuthorDialog from '@/dialog/update-create-author';
import AuthorsListDialog from '@/dialog/authors-list';
import { useSearchParams } from 'react-router';

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

  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = useMemo(() => {
    return (
      showDialog === Dialogs.updateOrCreateBook ||
      showDialog === Dialogs.updateOrCreateAuthor ||
      showDialog === Dialogs.deleteBook ||
      showDialog === Dialogs.authorsList
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

          searchParams.delete('edit');
          searchParams.delete('delete');
          searchParams.delete('editAuthorId');

          setSearchParams(searchParams);
          setShowDialog(Dialogs.none);
        }}
        className="md:w-[600px] lg:w-[720px]"
        okButtonProps={{ style: { display: 'none' } }}
        forceRender={true}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {showDialog === Dialogs.updateOrCreateBook && (
          <UpdateOrCreateBookDialog />
        )}
        {showDialog === Dialogs.updateOrCreateAuthor && (
          <UpdateOrCreateAuthorDialog />
        )}
        {showDialog === Dialogs.deleteBook && <DeleteBookDialog />}
        {showDialog === Dialogs.authorsList && <AuthorsListDialog />}
      </Modal>
    </>
  );
};

export default DialogProvider;
