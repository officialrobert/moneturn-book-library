import type { IAuthor, IPagination } from '@/types';
import { getServerApiBaseUrl } from '@/helpers';
import axios from 'axios';

/**
 * Triggers the creation of a new author.
 *
 * @param {Object} params - The parameters for creating a new author.
 * @param {string} params.name - The name of the author.
 * @param {string} params.bio - The bio of the author.
 * @returns {Promise<IAuthor | undefined>} The created author or undefined if the request fails.
 */
export async function createNewAuthorInfoApi(params: {
  name: string;
  bio?: string;
}): Promise<IAuthor | undefined> {
  const { name, bio } = params;
  const url = getServerApiBaseUrl();
  const res = await axios.post<{ author: IAuthor }>(`${url}/authors`, {
    name,
    bio,
  });

  return res?.data?.author;
}

/**
 * Search for authors based on the provided search query.
 *
 * @param {Object} params - The parameters for searching authors.
 * @param {string} params.search - The search query.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of authors per page.
 * @returns {Promise<{ authors: IAuthor[]; pagination: IPagination }>} The search results.
 */
export async function searchForAuthorsApi(params: {
  search: string;
  page?: number;
  limit?: number;
}): Promise<{ authors: IAuthor[]; pagination: IPagination }> {
  const { search, page = 1, limit } = params;
  const url = getServerApiBaseUrl();

  const searchParams = new URLSearchParams({
    search,
    page: page.toString(),
    limit: limit?.toString() || '10',
  });

  const res = await axios.get<{
    authors: IAuthor[];
    pagination: IPagination;
  }>(`${url}/authors/search?${searchParams.toString()}`);

  return { ...res?.data };
}

/**
 * Get authors list by page.
 *
 * @param {Object} params - The parameters for getting authors list.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of authors per page.
 * @returns {Promise<{ authors: IAuthor[]; pagination: IPagination }>}
 * The authors list and pagination information.
 */
export async function getAuthorListByPageApi(params: {
  page: number;
  limit?: number;
}): Promise<{ authors: IAuthor[]; pagination: IPagination }> {
  const { page, limit = 10 } = params;

  const url = getServerApiBaseUrl();

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit?.toString() || '10',
  });

  const res = await axios.get<{
    authors: IAuthor[];
    pagination: IPagination;
  }>(`${url}/authors/list?${searchParams.toString()}`);

  return { ...res?.data };
}
