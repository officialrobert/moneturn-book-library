import { FastifySchema } from 'fastify';

export const getBooksByPageShema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number' },
      limit: { type: 'number' },
    },
    required: ['page', 'limit'],
  },
};

export const getBookByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
};
