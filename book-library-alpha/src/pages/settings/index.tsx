import { Button } from 'antd';
import { Modal } from 'antd';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/shallow';
import { Dialogs } from '../../types';
import { PlusCircleFilled } from '@ant-design/icons';

import Header from '../../common/header';
import CreateBookDialog from '../../dialog/create-book';

const SettingsPage = () => {
  const { showDialog, submittingNewBook, setShowDialog } = useAppStore(
    useShallow((state) => ({
      showDialog: state.showDialog,
      submittingNewBook: state.submittingNewBook,
      setShowDialog: state.setShowDialog,
    })),
  );

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
                onClick={() => setShowDialog(Dialogs.createBook)}
              >
                New Book
                <PlusCircleFilled />
              </Button>
              <Button type="primary" className="w-full mt-4">
                New Author <PlusCircleFilled />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showDialog === Dialogs.createBook}
        closable
        maskClosable={false}
        onCancel={() => {
          if (submittingNewBook) {
            return;
          }

          setShowDialog(Dialogs.none);
        }}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {showDialog === Dialogs.createBook && <CreateBookDialog />}
      </Modal>
    </>
  );
};

export default SettingsPage;
