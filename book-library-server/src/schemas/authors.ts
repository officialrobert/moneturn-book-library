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
