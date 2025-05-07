import { ZodError } from 'zod';
import { GraphQLError } from 'graphql';
import {
  updateInputSchema,
  leadInputSchema,
  findOneLeadSchema,
  findManyLeadSchema,
  leadSortSchema,
} from '@/validations/lead.validation';
import { paginationSchema } from '@/validations/base.validation';
import { PaginationOptions } from '@/types/queryOptions';
import { LeadQueries, LeadMutations, LeadAttributesQuery } from '@/types/lead';
import { Prisma } from '@/generated/prisma';

const Query: LeadQueries = {
  leads: async (_parent, args, context) => {
    try {
      const { filterBy = {}, pagination = {}, orderBy = {} } = args;
      const {
        name: leadName,
        createdAt: leadCreatedAt,
        ...leadFilter
      } = findManyLeadSchema.parse(filterBy);

      const parsedOrderBy = leadSortSchema.parse(orderBy);
      const { paginate, limit, page } = paginationSchema.parse(pagination);

      let paginationOptions: PaginationOptions | Record<never, never> = {};
      if (paginate) {
        paginationOptions = {
          skip: (page - 1) * limit,
          take: limit,
        };
      }

      const whereClause: Prisma.LeadWhereInput = { ...leadFilter };

      if (leadName) {
        whereClause.name = {
          contains: leadName,
          mode: 'insensitive',
        } as Prisma.StringFilter;
      }

      if (leadCreatedAt) {
        const currentLeadDate = new Date(leadCreatedAt);
        const futureDate = new Date(currentLeadDate);
        futureDate.setDate(currentLeadDate.getDate() + 1);

        whereClause.createdAt = {
          gte: currentLeadDate,
          lt: futureDate,
        } as Prisma.DateTimeFilter;
      }

      const leads = await context.prisma.lead.findMany({
        where: whereClause,
        ...paginationOptions,
        orderBy: parsedOrderBy,
      });

      return leads;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new GraphQLError(error.issues[0].message, {
          extensions: {
            code: 'VALIDATION_ERROR',
          },
        });
      }

      throw error;
    }
  },

  lead: async (_parent, args, context) => {
    try {
      const { id, email, mobile } = findOneLeadSchema.parse(args);

      const whereClause = id ? { id } : email ? { email } : { mobile };
      const lead = await context.prisma.lead.findUnique({
        where: whereClause,
      });

      if (!lead) {
        throw new GraphQLError('Lead not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }

      return lead;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new GraphQLError(error.issues[0].message, {
          extensions: {
            code: 'VALIDATION_ERROR',
          },
        });
      }

      throw error;
    }
  },
};

const Mutation: LeadMutations = {
  register: async (_parent, { input }, { prisma }) => {
    try {
      const parsedLead = leadInputSchema.parse(input);
      const newLead = await prisma.lead.create({
        data: parsedLead,
      });

      return newLead;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new GraphQLError(error.issues[0].message, {
          extensions: {
            code: 'VALIDATION_ERROR',
          },
        });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new GraphQLError(
            `[${error.code}]: A user with the same email or mobile number already exists.`,
            {
              extensions: {
                code: 'BAD_REQUEST',
              },
            },
          );
        }
      }

      if (error instanceof Error) {
        throw new Error(error.message || 'Cannot create new lead.');
      }

      throw error;
    }
  },

  updateLead: async (_parent, { id, input }, { prisma }) => {
    try {
      const updatePayload = updateInputSchema.parse(input);

      const isLeadExisting = await prisma.lead.findUnique({
        where: {
          id,
        },
      });

      if (!isLeadExisting) {
        throw new GraphQLError('Lead not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }

      const updatedLead = await prisma.lead.update({
        where: {
          id,
        },
        data: updatePayload,
      });

      return updatedLead;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new GraphQLError(
            `[${error.code}]: A user with the same email or mobile number already exists.`,
            {
              extensions: {
                code: 'BAD_REQUEST',
              },
            },
          );
        }
      }

      throw error;
    }
  },
};

const Lead: LeadAttributesQuery = {
  createdAt: parent => parent.createdAt.toISOString(),
  updatedAt: parent => parent.updatedAt.toISOString(),
};

export const resolvers = {
  Query,
  Mutation,
  Lead,
};
