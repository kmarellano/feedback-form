import { Lead } from './models';
import { Context } from './context';

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
