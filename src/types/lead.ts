import { z } from 'zod';
import { Lead } from './models';
import { Context } from '@/context';
import {
  leadInputSchema,
  findOneLeadSchema,
} from '@/validations/lead.validation';

export interface LeadQueries {
  lead: (
    parent: unknown,
    args: z.infer<typeof findOneLeadSchema>,
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
