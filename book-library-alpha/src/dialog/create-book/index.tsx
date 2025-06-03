import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../../store';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { Button, Input, Select, Result } from 'antd';
import type { INewBookSubmitForm } from '../../types';
import { createNewBookInfoApi } from '../../apis';
import { useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useAuthors, useDialog } from '../../hooks';
import { cn } from '../../lib';
import { delay, grabApiErrorMessage } from '../../helpers';
import type { AxiosError } from 'axios';

const CreateBookDialog = () => {
  const { submittingNewBook, setSubmittingNewBook } = useAppStore(
    useShallow((state) => ({
      submittingNewBook: state.submittingNewBook,
      setSubmittingNewBook: state.setSubmittingNewBook,
    })),
  );

  const { closeDialog } = useDialog();

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState('');

  const { authorsList } = useAuthors();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<INewBookSubmitForm>();

  const handleCreateNewBook: SubmitHandler<INewBookSubmitForm> = async (
    data,
  ) => {
    if (!data || submittingNewBook) {
      return;
    }
    setSubmittingNewBook(true);

    try {
      await createNewBookInfoApi({
        title: data.title,
        shortSummary: data.shortSummary,
        imagePreview: data.imagePreview || '',
        authorId: data.authorId || '',
      });

      // simulate delay
      await delay(500);

      setSuccess(true);
    } catch (err) {
      setError(grabApiErrorMessage(err as Error | AxiosError));
      setValue('title', '');
      setValue('shortSummary', '');
      setValue('imagePreview', '');
    } finally {
      setSubmittingNewBook(false);
    }
  };

  const errorMessage = useMemo(() => {
    if (error) {
      return error;
    }
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
  }, [errors, error]);

  return (
    <div className="relative w-full box-border">
      <div
        className={cn(
          success
            ? 'relative w-full flex justify-center items-center'
            : 'hidden w-0 overflow-hidden',
        )}
      >
        <Result
          status="success"
          title="Book created successfully"
          subTitle="It may take a few seconds for the book to appear in the list."
          extra={[
            <Button
              key="1"
              type="primary"
              className="min-w-[60px]"
              onClick={() => closeDialog()}
            >
              Ok
            </Button>,
          ]}
        />
      </div>

      <form
        onSubmit={handleSubmit(handleCreateNewBook)}
        className={cn(
          success
            ? 'hidden w-0 h-0'
            : 'relative w-full mt-8 gap-4 flex flex-col',
        )}
      >
        <Controller
          control={control}
          rules={{
            required: 'Title is required',
          }}
          name="title"
          render={({ field }) => (
            <div className="relative flex flex-col justify-start items-start w-full box-border gap-2">
              <p className="text-sm pl-2">Title</p>
              <Input
                placeholder="Title"
                className="relative w-full"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          rules={{
            required: 'Short summary is required',
          }}
          name="shortSummary"
          render={({ field }) => (
            <div className="relative flex flex-col justify-start items-start w-full box-border gap-2">
              <p className="text-sm pl-2">Short Summary</p>
              <Input
                placeholder="Short Summary"
                className="relative w-full"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="imagePreview"
          render={({ field }) => (
            <div className="relative flex flex-col justify-start items-start w-full box-border gap-2">
              <p className="text-sm pl-2">URL to image preview (optional)</p>
              <Input
                placeholder="https://example.com/image.jpg"
                className="relative w-full box-border"
                {...field}
              />
            </div>
          )}
        />

        <div className="relative w-full box-border">
          <div className="relative w-full">
            <Controller
              control={control}
              rules={{
                required: 'Author is required',
              }}
              name="authorId"
              render={({ field }) => (
                <div className="relative flex flex-col justify-start items-start w-full box-border gap-2">
                  <p className="text-sm pl-2">Author</p>
                  <Select
                    {...field}
                    className="relative w-full"
                    options={authorsList.map((author) => ({
                      value: author.id,
                      label: author.name,
                    }))}
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    placeholder="Search for author name"
                    showSearch
                  />
                </div>
              )}
            />
          </div>
        </div>

        {!isEmpty(errorMessage) && (
          <div className="relative w-full flex justify-center items-center mt-2">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        <div
          className={cn(
            'relative w-full flex justify-end items-center',
            !isEmpty(errorMessage) ? 'mt-2' : 'mt-4',
          )}
        >
          <Button loading={submittingNewBook} type="primary" htmlType="submit">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBookDialog;
