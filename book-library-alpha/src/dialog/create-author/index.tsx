import { useMemo, useState } from 'react';
import { useDialog } from '../../hooks';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/shallow';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { type INewAuthorSubmitForm } from '../../types';
import { cn } from '../../lib';
import { Button, Input, Result } from 'antd';
import { grabApiErrorMessage, delay } from '../../helpers';
import { createNewAuthorInfoApi } from '../../apis';
import { AxiosError } from 'axios';
import { isEmpty } from 'lodash';

const CreateAuthorDialog = () => {
  const { isUpdatingOrSubmittingAuthor, setIsUpdatingOrSubmittingAuthor } =
    useAppStore(
      useShallow((state) => ({
        isUpdatingOrSubmittingAuthor: state.isUpdatingOrSubmittingAuthor,
        setIsUpdatingOrSubmittingAuthor: state.setIsUpdatingOrSubmittingAuthor,
      })),
    );

  const { closeDialog } = useDialog();

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState('');

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<INewAuthorSubmitForm>();

  const handleCreateNewAuthor: SubmitHandler<INewAuthorSubmitForm> = async (
    data,
  ) => {
    if (!data || isUpdatingOrSubmittingAuthor) {
      return;
    }

    setIsUpdatingOrSubmittingAuthor(true);

    try {
      await createNewAuthorInfoApi({
        name: data.name,
        bio: data.bio,
      });

      // simulate delay
      await delay(1000);

      setSuccess(true);
    } catch (err) {
      setError(grabApiErrorMessage(err as Error | AxiosError));
      setValue('name', '');
      setValue('bio', '');
    } finally {
      setIsUpdatingOrSubmittingAuthor(false);
    }
  };

  const errorMessage = useMemo(() => {
    if (error) {
      return error;
    }
    if (errors.name) {
      return errors.name.message;
    }

    if (errors.bio) {
      return errors.bio.message;
    }

    return null;
  }, [errors, error]);

  const clearValues = () => {
    setValue('name', '');
    setValue('bio', '');
  };

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
          title="Author created successfully"
          subTitle="It may take a few seconds for the author to appear in the list."
          extra={[
            <Button
              key="1"
              type="primary"
              className="min-w-[60px]"
              onClick={() => {
                clearValues();
                setSuccess(false);
                closeDialog();
              }}
            >
              Continue
            </Button>,
          ]}
        />
      </div>

      <form
        onSubmit={handleSubmit(handleCreateNewAuthor)}
        className={cn(
          success
            ? 'hidden w-0 h-0'
            : 'relative w-full mt-8 gap-4 flex flex-col',
        )}
      >
        <Controller
          control={control}
          rules={{
            required: 'Author name is required',
          }}
          defaultValue=""
          name="name"
          render={({ field }) => (
            <div className="relative flex flex-col justify-start items-start w-full box-border gap-2">
              <p className="text-sm pl-2">Author name</p>
              <Input
                placeholder="Author name"
                className="relative w-full"
                allowClear
                {...field}
              />
            </div>
          )}
        />

        <Controller
          control={control}
          rules={{
            required: 'Author bio is required',
          }}
          defaultValue=""
          name="bio"
          render={({ field }) => (
            <div className="relative flex flex-col justify-start items-start w-full box-border gap-2">
              <p className="text-sm pl-2">Author bio</p>
              <Input
                placeholder="Author bio"
                className="relative w-full"
                allowClear
                {...field}
              />
            </div>
          )}
        />

        {!isEmpty(errorMessage) && (
          <div className="relative w-full flex justify-center items-center mt-2">
            <p className="text-red-500 text-md">{errorMessage}</p>
          </div>
        )}

        <div
          className={cn(
            'relative w-full flex justify-end items-center',
            isEmpty(errorMessage) ? 'mt-2' : 'mt-4',
          )}
        >
          <Button
            loading={isUpdatingOrSubmittingAuthor}
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

export default CreateAuthorDialog;
