import { FastifySchema } from 'fastify';

export const getAuthorByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
};

export const getAuthorListByPageSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number' },
      limit: { type: 'number' },
    },
    required: ['page', 'limit'],
  },
};

export const addNewAuthorInfoSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      bio: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  },
};

export const deleteAuthorByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
};

export const updateAuthorInfoByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      bio: { type: 'string' },
    },
    additionalProperties: false,
  },
};
