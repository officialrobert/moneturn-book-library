import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../../store';
import { Dialogs } from '../../types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button, Input } from 'antd';
import type { INewBookSubmitForm } from '../../types';
import { createNewBookInfoApi } from '../../apis';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';

const CreateBookDialog = () => {
  const { setShowDialog } = useAppStore(
    useShallow((state) => ({
      setShowDialog: state.setShowDialog,
    })),
  );

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<INewBookSubmitForm>();

  const handleCreateNewBook: SubmitHandler<INewBookSubmitForm> = async (
    data,
  ) => {
    if (!data) {
      return;
    }

    try {
      const res = await createNewBookInfoApi({
        title: data.title,
        shortSummary: data.shortSummary,
        imagePreview: data.imagePreview,
        authorId: data.authorId || '',
      });

      if (!res) {
        throw new Error('Failed to create new book');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowDialog(Dialogs.none);
    }
  };

  const errorMessage = useMemo(() => {
    if (errors.title) {
      return errors.title.message;
    }

    if (errors.shortSummary) {
      return errors.shortSummary.message;
    }

    if (errors.imagePreview) {
      return errors.imagePreview.message;
    }

    if (errors.authorId) {
      return errors.authorId.message;
    }

    return null;
  }, [errors]);

  return (
    <div className="relative w-full box-border">
      <form
        onSubmit={handleSubmit(handleCreateNewBook)}
        className="relative w-full mt-6 gap-4 flex flex-col"
      >
        <Input placeholder="Title" className="relative w-full" />
        <Input placeholder="Short Summary" className="relative w-full" />
        <Input placeholder="Image Preview" className="relative w-full" />
        <Input placeholder="Author ID" className="relative w-full" />

        {!isEmpty(errorMessage) && (
          <div className="relative w-full flex justify-center items-center mt-2">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        <div className="relative w-full flex justify-end items-center mt-2">
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBookDialog;
