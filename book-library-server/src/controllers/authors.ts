import { IAuthor, IPagination } from '@/types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { desc, sql, isNull, or, gt } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import {
  createNewAuthor,
  deleteAuthorById,
  getAuthorById,
  getNowDateInISOString,
  updateAuthorPropsById,
} from '@/helpers';
import { head, isEmpty, isNumber } from 'lodash';
import { authors, db } from '@/db';

/**
 * Get author info by id
 *
 * @param {FastifyRequest<{Params: {id: string;}}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ author: IAuthor }>}
 */
export async function getAuthorInfoByIdController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ author: IAuthor }> {
  const { id } = request.params;
  const author = await getAuthorById(id);

  if (!author) {
    reply.status(404);
    throw new Error('Author not found');
  }

  return { author };
}

/**
 * Get author list by page
 *
 * @param {FastifyRequest<{Querystring: {page: number;limit: number;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ authors: IAuthor[]; pagination: IPagination }>}
 */
export async function getAuthorListByPageController(
  request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
  reply: FastifyReply,
): Promise<{ authors: IAuthor[]; pagination: IPagination }> {
  const { page = 1, limit = 10 } = request.query;

  const offset = (page - 1) * limit;

  const currentDate = getNowDateInISOString();

  const [authorsResult, totalCount] = await Promise.all([
    db
      .select({
        id: authors.id,
      })
      .from(authors)
      .where(or(isNull(authors.deletedAt), gt(authors.deletedAt, currentDate)))
      .orderBy(desc(authors.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql`count(*)` })
      .from(authors)
      .where(or(isNull(authors.deletedAt), gt(authors.deletedAt, currentDate))),
  ]);

  const authorsEnriched = await Promise.all(
    authorsResult.map(async (author) => {
      const authorInfo = await getAuthorById(author.id);
      return authorInfo;
    }),
  );

  const totalPages = Math.ceil(Number(head(totalCount)?.count) / limit);

  const pagination: IPagination = {
    currentPage: page,
    totalPages: isNumber(totalPages) && totalPages > 0 ? totalPages : 1,
    totalItems: Number(head(totalCount)?.count),
    itemsPerPage: limit,
  };

  reply.status(200);
  return {
    pagination,
    authors: authorsEnriched,
  };
}

/**
 * Add new author info
 *
 * @param {FastifyRequest<{Body: {name: string;bio: string;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ author: IAuthor }>}
 */
export async function addNewAuthorInfoController(
  request: FastifyRequest<{
    Body: {
      name: string;
      bio?: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ author: IAuthor }> {
  const { name, bio } = request.body;
  const authorId = uuid();
  const today = getNowDateInISOString();
  const author: IAuthor = {
    id: authorId,
    name,
    bio: bio || null,
    createdAt: today.toISOString(),
    updatedAt: null,
    deletedAt: null,
  };

  if (!name) {
    reply.status(400);
    throw new Error("'name' is required");
  }

  const newAuthor = await createNewAuthor({ ...author });

  reply.status(201);
  return { author: newAuthor };
}

/**
 * Update author info by id
 *
 * @param {FastifyRequest<{Params: {id: string;};Body: {name: string;bio: string;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ author: IAuthor }>}
 */
export async function updateAuthorInfoByIdController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: {
      name: string;
      bio: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ author: IAuthor }> {
  const { id } = request.params;
  const { name, bio } = request.body;

  if (!name && !bio) {
    reply.status(400);
    throw new Error("'name' or 'bio' is required");
  }

  const updatedAuthor = await updateAuthorPropsById(id, {
    ...(!isEmpty(name) && { name }),
    ...(!isEmpty(bio) && { bio }),
  });

  reply.status(200);
  return { author: updatedAuthor };
}

/**
 * Delete author info by id
 *
 * @param {FastifyRequest<{Params: {id: string;};}>} request
 * @param {FastifyReply} reply
 * @returns {Promise<{ message: string; author?: IAuthor }>}
 */
export async function deleteAuthorInfoController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ message: string; author?: IAuthor }> {
  const { id } = request.params;

  const deletedAuthor = await deleteAuthorById(id);

  reply.status(200);
  return {
    message: 'Deleted',
    author: deletedAuthor,
  };
}
