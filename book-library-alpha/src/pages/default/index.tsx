import { useBooks, useDebounce } from '../../hooks';
import { Button, Input, Space } from 'antd';
import { cloneDeep, map } from 'lodash';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useMemo, useState } from 'react';
import type { IBook, IPagination } from '../../types';
import { getServerApiBaseUrl } from '../../helpers';

import Header from '../../common/header';
import BookCard from '../../common/book-card';
import axios from 'axios';

const { Search } = Input;

const DefaultPage = () => {
  const { books } = useBooks();

  const { control, handleSubmit, watch } = useForm<{ searchInput: string }>();

  const [searchResults, setSearchResults] = useState<IBook[]>([]);

  const [showSearchResults, setShowSearchResults] = useState(false);

  const [searching, setSearching] = useState(false);

  const handleSearch = useDebounce(async (searchInput: string) => {
    try {
      const res = await axios.get<{ books: IBook[]; pagination: IPagination }>(
        `${getServerApiBaseUrl()}/books/search?search=${searchInput}`,
      );

      const { books } = res.data;

      setSearchResults(cloneDeep(books));
      setShowSearchResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }, 100);

  const onSubmit: SubmitHandler<{ searchInput: string }> = (data) => {
    if (searching) {
      return;
    }

    if (data?.searchInput) {
      setSearching(true);
      handleSearch(data?.searchInput);
    }
  };

  const booksPreview = useMemo(() => {
    if (watch('searchInput') && showSearchResults) {
      return searchResults;
    }

    return books;
  }, [watch, showSearchResults, searchResults, books]);

  return (
    <div className="relative w-full box-border min-h-[100vh] mb-[100px]">
      <Header />

      <div className="relative w-full flex justify-center item-start mt-[300px]">
        <div className="relative w-full flex flex-col items-center justify-start lg:max-w-[1024px] md:max-w-[768px]">
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <Space.Compact className="relative max-w-[300px] md:max-w-[500px] lg:w-[600px]">
              <Controller
                name="searchInput"
                control={control}
                render={({ field }) => (
                  <Search
                    placeholder="Search for books"
                    type="text"
                    className="relative max-w-[300px] md:max-w-[500px] lg:w-[600px]"
                    maxLength={40}
                    allowClear
                    enterButton={
                      <Button loading={searching} htmlType="submit">
                        Search
                      </Button>
                    }
                    onInput={(e) => {
                      if (!e.currentTarget.value) {
                        setShowSearchResults(false);
                      }
                    }}
                    onClear={() => {
                      setShowSearchResults(false);
                    }}
                    {...field}
                  />
                )}
              />
            </Space.Compact>
          </form>
          <div className="relative w-full mt-12">
            <ul className="relative flex flex-wrap justify-center items-start gap-4">
              {map(booksPreview, (book) => {
                const key = book?.id || '';

                return (
                  <li key={key} className="relative box-border">
                    <BookCard book={book} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
