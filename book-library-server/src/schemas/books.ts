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

export const searchBooksMatchSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      search: { type: 'string' },
      page: { type: 'number' },
      limit: { type: 'number' },
    },
    required: ['search'],
  },
};

export const insertNewBookSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      shortSummary: { type: 'string' },
      imagePreview: { type: 'string' },
      authorId: { type: 'string' },
    },
    required: ['title', 'shortSummary', 'imagePreview', 'authorId'],
    additionalProperties: false,
  },
};

export const updateBookInfoByIdSchema: FastifySchema = {
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
      title: { type: 'string' },
      shortSummary: { type: 'string' },
      imagePreview: { type: 'string' },
      authorId: { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const deleteBookInfoByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
};
