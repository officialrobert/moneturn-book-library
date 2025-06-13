import { useAuthors, useDialog } from '@/hooks';
import { Button, List } from 'antd';
import { isEmpty } from 'lodash';
import { deleteAuthorByIdApi } from '@/apis/authors';
import { useSearchParams } from 'react-router';
import { Dialogs } from '@/types';

const AuthorsList = () => {
  const { authorsList, isFetchingAuthorsList, refetchAuthorsList } =
    useAuthors();

  const [searchParams, setSearchParams] = useSearchParams();

  const { setShowDialog } = useDialog();

  const handleDeleteAuthor = async (id: string) => {
    try {
      await deleteAuthorByIdApi({ id });
      await refetchAuthorsList();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditAuthor = async (id: string) => {
    searchParams.set('editAuthorId', id);
    setSearchParams(searchParams);
    setShowDialog(Dialogs.updateOrCreateAuthor);
  };

  return (
    <div className="relative w-full box-border">
      <h1 className="relative w-full text-center text-lg">Authors List</h1>

      <List
        className="relative w-full box-border flex flex-col mt-8"
        dataSource={authorsList}
        loading={isFetchingAuthorsList && isEmpty(authorsList)}
        itemLayout="horizontal"
        renderItem={(author) => (
          <List.Item key={author.id} className="relative flex justify-between">
            <p className="text-md text-left">{author.name}</p>

            <div className="relative box-border gap-2">
              <Button
                type="text"
                className="relative flex"
                onClick={() => handleEditAuthor(author.id)}
              >
                Edit
              </Button>

              <Button
                type="text"
                className="relative flex"
                onClick={() => handleDeleteAuthor(author.id)}
              >
                Delete
              </Button>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AuthorsList;
