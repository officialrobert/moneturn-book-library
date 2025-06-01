import { IAuthor } from '@/types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuid } from 'uuid';
import {
  createNewAuthor,
  deleteAuthorById,
  getAuthorById,
  getNowDateInISOString,
  updateAuthorPropsById,
} from '@/helpers';

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

  const updatedAuthor = await updateAuthorPropsById(id, { name, bio });

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
