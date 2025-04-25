import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { app } from './app';
import { SERVER_CONFIG } from '@/config/appConfig';
import { typeDefs, resolvers } from '@/gql';

import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { PrismaClient } from './generated/prisma';

const httpServer = http.createServer(app);
const prisma = new PrismaClient();

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers: resolvers as GraphQLResolverMap<unknown>,
  }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await apolloServer.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer, {
    context: async () => ({
      prisma,
    }),
  }),
);

app.use(
  (
    err: Error & { status?: number },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    console.error(err.stack);

    return res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  },
);

const PORT = SERVER_CONFIG.PORT;
await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at ${PORT}`);

export { httpServer, app };
