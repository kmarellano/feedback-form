import { LeadQueries } from '@/types/lead';

const Query: LeadQueries = {
  leads: async (_parent, _args, context) => {
    return [
      {
        id: '1',
        name: 'name',
        email: 'test@gmail.com',
        mobile: '123123123',
        postcode: '1422',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  },

  lead: async (_parent, args, context) => {
    const { id } = args;
    return {
      id,
      name: 'name',
      email: 'test@gmail.com',
      mobile: '123123123',
      postcode: '1422',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};

const Mutation = {
  register: async () => {},
};

export const resolvers = {
  Query,
  Mutation,
};
