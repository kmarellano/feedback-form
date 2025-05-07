import { z } from 'zod';
import { Lead } from './models';
import { Context } from '@/context';
import {
  leadInputSchema,
  updateInputSchema,
  findOneLeadSchema,
  findManyLeadSchema,
  leadSortSchema,
} from '@/validations/lead.validation';

import { uuidSchema, paginationSchema } from '@/validations/base.validation';

export interface LeadQueries {
  lead: (
    parent: unknown,
    args: z.infer<typeof findOneLeadSchema>,
    context: Context,
  ) => Promise<Lead>;

  leads: (
    parent: unknown,
    args: {
      filterBy: z.infer<typeof findManyLeadSchema>;
      pagination: z.infer<typeof paginationSchema>;
      orderBy: z.infer<typeof leadSortSchema>;
    },
    context: Context,
  ) => Promise<Lead[]>;
}

export interface LeadMutations {
  register: (
    parent: unknown,
    args: { input: z.infer<typeof leadInputSchema> },
    context: Context,
  ) => Promise<Lead>;

  updateLead: (
    parent: unknown,
    args: {
      id: z.infer<typeof uuidSchema>;
      input: z.infer<typeof updateInputSchema>;
    },
    context: Context,
  ) => Promise<Lead>;
}

export interface LeadAttributesQuery {
  createdAt: (parent: Pick<Lead, 'createdAt'>) => string;
  updatedAt: (parent: Pick<Lead, 'updatedAt'>) => string;
}
