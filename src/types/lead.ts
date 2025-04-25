import { z } from 'zod';
import { Lead } from './models';
import { Context } from '@/context';
import { leadInputSchema } from '@/validations/lead.validation';

interface LeadParameter {
  id: string;
}

export interface LeadQueries {
  lead: (
    parent: unknown,
    args: LeadParameter,
    context: Context,
  ) => Promise<Lead>;

  leads: (parent: unknown, args: unknown, context: Context) => Promise<Lead[]>;
}

export interface LeadMutations {
  register: (
    parent: unknown,
    args: { input: z.infer<typeof leadInputSchema> },
    context: Context,
  ) => Promise<Lead>;
}
