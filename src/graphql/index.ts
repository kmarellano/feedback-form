import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getFiles } from '@/utils/fileUtility';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const schemaFiles = await getFiles(__dirname, 'schemas', '.schema.ts');
const typeDefinitions = await Promise.all(
  schemaFiles.map(async file => {
    const filePath = pathToFileURL(file).href;
    const module = await import(filePath);
    return module.typeDefs;
  }),
);

const resolverFiles = await getFiles(__dirname, 'resolvers', '.resolver.ts');
const schemaResolvers = await Promise.all(
  resolverFiles.map(async file => {
    const filePath = pathToFileURL(file).href;
    const module = await import(filePath);
    return module.resolvers;
  }),
);

export const typeDefs = mergeTypeDefs(typeDefinitions);
export const resolvers = mergeResolvers(schemaResolvers);
