import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';
import { app } from './app';
import { SERVER_CONFIG } from '@/config/appConfig';
import { typeDefs, resolvers } from './graphql';

import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const httpServer = http.createServer(app);
const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers: resolvers as GraphQLResolverMap<unknown>,
  }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true,
});

await apolloServer.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(apolloServer),
);

const PORT = SERVER_CONFIG.PORT;
await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at ${PORT}`);

export { httpServer, app };
