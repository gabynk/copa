import { FastifyInstance } from 'fastify';

import { prisma } from "../lib/prisma";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users/count', async (_, reply) => {
    const count = await prisma.user.count();

    return reply.status(200).send({ count });
  })
}