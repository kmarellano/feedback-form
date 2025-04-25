import type { Request, Response } from 'express';
import type { PrismaClient } from '@prisma/client';

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClient;
}
