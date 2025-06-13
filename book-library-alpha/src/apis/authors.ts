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
  const { page, limit = 20 } = params;

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

/**
 * Get author info by id.
 *
 * @param {Object} params - The parameters for getting author info.
 * @param {string} params.id - The id of the author.
 * @returns {Promise<{ author: IAuthor }>}
 * The author info.
 */
export async function getAuthorInfoByIdApi(params: {
  id: string;
}): Promise<{ author: IAuthor }> {
  const { id } = params;

  if (!id) {
    throw new Error('Author id is required');
  }

  const url = getServerApiBaseUrl();

  const res = await axios.get<{ author: IAuthor }>(`${url}/authors/${id}`);

  return res?.data;
}

/**
 * Update author info by id.
 *
 * @param {Object} params - The parameters for updating author info.
 * @param {string} params.id - The id of the author. (required)
 * @param {string} params.name - The name of the author. (optional)
 * @param {string} params.bio - The bio of the author. (optional)
 * @returns {Promise<{ author: IAuthor }>}
 * The updated author info.
 */
export async function updateAuthorInfoByIdApi(params: {
  id: string;
  name?: string;
  bio?: string;
}): Promise<{ author: IAuthor }> {
  const { id, name, bio } = params;

  if (!id) {
    throw new Error('Author id is required');
  }

  const url = getServerApiBaseUrl();

  const res = await axios.patch<{ author: IAuthor }>(`${url}/authors/${id}`, {
    name,
    bio,
  });

  return res?.data;
}

/**
 * Delete author info by id.
 *
 * @param {Object} params - The parameters for deleting author info.
 * @param {string} params.id - The id of the author. (required)
 * @returns {Promise<{ author: IAuthor }>}
 * The deleted author info.
 */
export async function deleteAuthorByIdApi(params: {
  id: string;
}): Promise<{ author: IAuthor }> {
  const { id } = params;

  if (!id) {
    throw new Error('Author id is required');
  }

  const url = getServerApiBaseUrl();

  const res = await axios.delete<{ author: IAuthor }>(`${url}/authors/${id}`);

  return res?.data;
}
