import { authors, db } from '@/db';
import { eq } from 'drizzle-orm';
import { IAuthor } from '@/types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { head } from 'lodash';

export async function getAuthorInfoByIdController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
): Promise<{ author: IAuthor }> {
  const { id } = request.params;

  const authorsList = await db
    .select({
      id: authors.id,
      name: authors.name,
      bio: authors.bio,
      createdAt: authors.createdAt,
      updatedAt: authors.updatedAt,
      deletedAt: authors.deletedAt,
    })
    .from(authors)
    .where(eq(authors.id, id))
    .limit(1);
  const author = head(authorsList);

  if (!author) {
    reply.status(404);
    throw new Error('Author not found');
  }

  return { author: author as unknown as IAuthor };
}
