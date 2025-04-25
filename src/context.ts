import { PrismaClient } from './generated/prisma';
import type { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
};

export async function createContext({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<Context> {
  return {
    prisma,
  };
}
