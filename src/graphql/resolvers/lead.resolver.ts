import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';
import {
  leadInputSchema,
  findOneLeadSchema,
} from '@/validations/lead.validation';
import { LeadQueries, LeadMutations } from '@/types/lead';
import { Prisma } from '@/generated/prisma';

const Query: LeadQueries = {
  leads: async (_parent, _args, context) => {
    return [
      {
        id: '1',
        name: 'name',
        email: 'test@gmail.com',
        mobile: '123123123',
        postcode: '1422',
        preferredService: 'DELIVERY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
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
          throw new Error(
            `[${error.code}]: A user with the same email or mobile number already exists.`,
          );
        }
      }

      if (error instanceof Error) {
        throw new Error(error.message || 'Cannot create new lead.');
      }

      throw error;
    }
  },
};

export const resolvers = {
  Query,
  Mutation,
};
