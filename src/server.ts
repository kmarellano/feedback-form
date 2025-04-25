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
import { createContext } from '@/context';
import { loggerPlugin } from '@/plugins/logger.plugin';

const httpServer = http.createServer(app);
const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers: resolvers as GraphQLResolverMap<unknown>,
  }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), loggerPlugin],
});

await apolloServer.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer, {
    context: createContext,
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
