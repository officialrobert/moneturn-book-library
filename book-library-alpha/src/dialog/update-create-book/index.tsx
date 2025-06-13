import { useShallow } from 'zustand/shallow';
import { useAppStore } from '@/store';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { Button, Input, Select, Result } from 'antd';
import type { INewBookSubmitForm } from '@/types';
import { createNewBookInfoApi, updateBookInfoApi } from '@/apis';
import { useEffect, useMemo, useState } from 'react';
import { isEmpty, trim } from 'lodash';
import { useAuthors, useBooks, useDialog } from '@/hooks';
import { cn } from '@/lib';
import { delay, grabApiErrorMessage, isValidURLForImage } from '@/helpers';
import type { AxiosError } from 'axios';
import { bookShortSummaryMaxLength, bookTitleMaxLength } from '@/constants';

const UpdateOrCreateBookDialog = () => {
  const { isUpdatingOrSubmittingBook, setIsUpdatingOrSubmittingBook } =
    useAppStore(
      useShallow((state) => ({
        isUpdatingOrSubmittingBook: state.isUpdatingOrSubmittingBook,
        setIsUpdatingOrSubmittingBook: state.setIsUpdatingOrSubmittingBook,
      })),
    );

  const { closeDialog } = useDialog();

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState('');

  const { authorsList } = useAuthors();

  const { editBookId, book, isFetchingBookInfo, fetchBooksList } = useBooks();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<INewBookSubmitForm>();

  const isUpdatingBook = useMemo(() => !!editBookId, [editBookId]);

  const isLoadingBookInfoToUpdate = useMemo(
    () =>
      isUpdatingBook &&
      isFetchingBookInfo &&
      (!book || book?.id !== editBookId),
    [isFetchingBookInfo, book, editBookId, isUpdatingBook],
  );

  const handleCreateNewBook: SubmitHandler<INewBookSubmitForm> = async (
    data,
  ) => {
    if (!data || isUpdatingOrSubmittingBook || isLoadingBookInfoToUpdate) {
      return;
    }

    try {
      const imagePreview = trim(data.imagePreview || '');
      const title = trim(data.title || '');
      const shortSummary = trim(data.shortSummary || '');
      const authorId = data.authorId || '';
      const props = {
        imagePreview,
        title,
        shortSummary,
        authorId,
      };

      if (imagePreview && !isValidURLForImage(imagePreview)) {
        setError('Invalid image URL');
        return;
      }

      setIsUpdatingOrSubmittingBook(true);

      if (isUpdatingBook) {
        await updateBookInfoApi({
          id: editBookId,
          ...props,
        });
      } else {
        await createNewBookInfoApi({
          ...props,
        });
      }

      // simulate delay
      await delay(1000);
      await fetchBooksList();

      setSuccess(true);
    } catch (err) {
      setError(grabApiErrorMessage(err as Error | AxiosError));

      if (!isUpdatingBook) {
        setValue('title', '');
        setValue('shortSummary', '');
        setValue('imagePreview', '');
      }
    } finally {
      setIsUpdatingOrSubmittingBook(false);
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

  const clearValues = () => {
    setValue('title', '');
    setValue('shortSummary', '');
    setValue('imagePreview', '');
    setValue('authorId', '');
  };

  /**
   * Initialize form values when book info is fetched
   */
  useEffect(() => {
    if (!isEmpty(editBookId) && book?.id === editBookId) {
      setValue('title', book.title);
      setValue('shortSummary', book.shortSummary);
      setValue('imagePreview', book.imagePreview);
      setValue('authorId', book.authorId);
    }
  }, [book, editBookId, setValue]);

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
          title={
            isUpdatingBook
              ? 'Book updated successfully'
              : 'Book created successfully'
          }
          subTitle={
            isUpdatingBook
              ? 'It may take a few seconds for the updates to propagate.'
              : 'It may take a few seconds for the book to appear in the list.'
          }
          extra={[
            <Button
              key="1"
              type="primary"
              className="min-w-[60px]"
              onClick={() => {
                setSuccess(false);
                clearValues();
                closeDialog();
              }}
            >
              Continue
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
                allowClear
                maxLength={bookTitleMaxLength}
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
                allowClear
                maxLength={bookShortSummaryMaxLength}
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
                allowClear
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

        {!isEmpty(errorMessage) && !isLoadingBookInfoToUpdate && (
          <div className="relative w-full flex justify-center items-center mt-2">
            <p className="text-red-500 text-md">{errorMessage}</p>
          </div>
        )}

        <div
          className={cn(
            isLoadingBookInfoToUpdate ? 'hidden w-0 overflow-hidden' : '',
            'relative w-full flex justify-end items-center',
            !isEmpty(errorMessage) ? 'mt-2' : 'mt-4',
          )}
        >
          <Button
            loading={isUpdatingOrSubmittingBook}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrCreateBookDialog;
