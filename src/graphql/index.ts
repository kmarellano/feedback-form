import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const typeDefinitions = loadFilesSync(
  path.join(import.meta.dirname, './schemas/*.schema.ts'),
  {
    extensions: ['ts'],
    ignoreIndex: true,
  }
);

const schemaResolvers = loadFilesSync(
  path.join(import.meta.dirname, './resolvers/*.resolver.ts'),
  {
    extensions: ['ts'],
    ignoreIndex: true,
    exportNames: ['resolvers'],
  }
);

export const typeDefs = mergeTypeDefs(typeDefinitions);
export const resolvers = mergeResolvers(schemaResolvers);
