import { gql } from 'graphql-tag';
import { typeDefs, resolvers } from '@/graphql';
import { ApolloServer } from '@apollo/server';
import { Context } from '@/context';
import { expect, describe, beforeAll, afterAll, it } from '@jest/globals';
import { PrismaClient } from '@/generated/prisma';

interface Lead {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  preferredService: string;
  createdAt: string;
  updatedAt: string;
}

let prisma: PrismaClient;
let server: ApolloServer<Context>;

beforeAll(async () => {
  prisma = new PrismaClient();

  server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await prisma.lead.createMany({
    data: [
      {
        id: '3c4fc05c-3fea-4ba5-8408-504764d5e56a',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
        postcode: '1234',
        preferredService: 'DELIVERY',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'b0d5e611-3126-46d1-95a1-8bbedbf8d673',
        name: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '0987654321',
        postcode: '5678',
        preferredService: 'PICKUP',
        createdAt: new Date('2024-01-02'),
      },
      {
        id: 'd38c67e0-a913-478e-b47b-a41adff980e8',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        mobile: '1122334455',
        postcode: '9012',
        preferredService: 'DELIVERY',
        createdAt: new Date('2024-01-03'),
      },
    ],
  });
});

afterAll(async () => {
  await prisma.lead.deleteMany();
  await prisma.$disconnect();
});

describe('Lead Query', () => {
  describe('QUERY [leads] => GET ALL LEADS', () => {
    const leadsQuery = gql`
      query Leads(
        $filterBy: LeadsParams
        $pagination: PaginationParams
        $orderBy: LeadsOrderParams
      ) {
        leads(filterBy: $filterBy, pagination: $pagination, orderBy: $orderBy) {
          id
          name
          email
          mobile
          postcode
          preferredService
          createdAt
          updatedAt
        }
      }
    `;

    it('should fetch all leads without filters', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.leads).toHaveLength(3);
      }
    });

    it('should return an empty list when filters do not match any leads', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            filterBy: {
              name: 'test',
              postcode: '000',
              preferredService: 'DELIVERY',
            },
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.leads).toHaveLength(0);
      }
    });

    it('should filter leads by "name" (case-insensitive)', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            filterBy: {
              name: 'john',
            },
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        const leads = result.body.singleResult.data?.leads as Lead[];
        expect(leads.length).toBeGreaterThanOrEqual(1);
        leads.forEach(lead => {
          expect(lead.name.toLowerCase()).toContain('john');
        });
      }
    });

    it('should filter leads by "createdAt" date', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            filterBy: {
              createdAt: '2024-01-02',
            },
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        const leads = result.body.singleResult.data?.leads as Lead[];
        expect(leads).toHaveLength(1);
        expect(leads[0].name).toBe('Jane Smith');
      }
    });

    it('should paginate leads', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            pagination: {
              paginate: true,
              page: 1,
              limit: 2,
            },
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.leads).toHaveLength(2);
      }
    });

    it('should not paginate leads when "paginate" is set to false', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            pagination: {
              paginate: false,
              page: 1,
              limit: 2,
            },
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.leads).toHaveLength(3);
      }
    });

    it('should sort leads by name in "ASC" order', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            orderBy: {
              name: 'ASC',
            },
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        const leads = result.body.singleResult.data?.leads as Lead[];
        expect(leads).toHaveLength(3);

        const sortedNames = [...leads].map(l => l.name).sort();
        leads.forEach((lead, index) => {
          expect(lead.name).toBe(sortedNames[index]);
        });
      }
    });

    it('should return error code of "VALIDATION_ERROR" when filterBy is defined and "NULL"', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            filterBy: null,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'VALIDATION_ERROR',
        );
      }
    });

    it('should return error code of "VALIDATION_ERROR" for invalid filter input of "createdAt"', async () => {
      const result = await server.executeOperation(
        {
          query: leadsQuery,
          variables: {
            filterBy: {
              createdAt: 'invalid-date',
            },
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'VALIDATION_ERROR',
        );
      }
    });
  });

  describe('Query [lead] => GET ONE LEAD', () => {
    const leadQuery = gql`
      query Lead($id: ID, $email: String, $mobile: String) {
        lead(id: $id, email: $email, mobile: $mobile) {
          id
          name
          email
          mobile
          postcode
          preferredService
          createdAt
          updatedAt
        }
      }
    `;

    it('should fetch all one lead when an "id" matches', async () => {
      const result = await server.executeOperation(
        {
          query: leadQuery,
          variables: {
            id: '3c4fc05c-3fea-4ba5-8408-504764d5e56a',
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();

        const lead = result.body.singleResult.data?.lead as Lead;
        expect(lead).toBeDefined();
        expect(lead.name).toBe('John Doe');
      }
    });

    it('should fetch all one lead when an "email" matches', async () => {
      const queryEmail = 'jane@example.com';
      const result = await server.executeOperation(
        {
          query: leadQuery,
          variables: {
            email: queryEmail,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();

        const lead = result.body.singleResult.data?.lead as Lead;
        expect(lead).toBeDefined();
        expect(lead.email).toBe(queryEmail);
      }
    });

    it('should fetch all one lead when an "email" matches', async () => {
      const queryMobile = '1122334455';
      const result = await server.executeOperation(
        {
          query: leadQuery,
          variables: {
            mobile: queryMobile,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();

        const lead = result.body.singleResult.data?.lead as Lead;
        expect(lead).toBeDefined();
        expect(lead.mobile).toBe(queryMobile);
      }
    });

    it('should return error code of "NOT_FOUND" when "id" does not match any leads', async () => {
      const result = await server.executeOperation(
        {
          query: leadQuery,
          variables: {
            id: '9a785a5b-2ad4-440d-ab56-a708f0606911',
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'NOT_FOUND',
        );
        const lead = result.body.singleResult.data;
        expect(lead).toBeNull();
      }
    });

    it('should return error code of "VALIDATION_ERROR" when "id" is not valid uui format', async () => {
      const result = await server.executeOperation(
        {
          query: leadQuery,
          variables: {
            id: 'test-test',
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'VALIDATION_ERROR',
        );
        const lead = result.body.singleResult.data;
        expect(lead).toBeNull();
      }
    });

    it('should return error code of "VALIDATION_ERROR" when no parameters are provided', async () => {
      const result = await server.executeOperation(
        {
          query: leadQuery,
          variables: {},
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'VALIDATION_ERROR',
        );
        const lead = result.body.singleResult.data;
        expect(lead).toBeNull();
      }
    });

    it('should return error code of "VALIDATION_ERROR" when multiple parameters are provided', async () => {
      const result = await server.executeOperation(
        {
          query: leadQuery,
          variables: {
            id: 'test-test',
            email: 'test@gmail.com',
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'VALIDATION_ERROR',
        );
        const lead = result.body.singleResult.data;
        expect(lead).toBeNull();
      }
    });
  });

  describe('Mutation [register] => CREATE NEW LEAD', () => {
    const registerMutation = gql`
      mutation RegisterLead($input: RegisterInput!) {
        register(input: $input) {
          id
          name
          email
          mobile
          postcode
          preferredService
          createdAt
          updatedAt
        }
      }
    `;

    it('should successfully register a new lead', async () => {
      const newLead = {
        name: 'New User',
        email: 'newuser@example.com',
        mobile: '9999999999',
        postcode: '1234',
        preferredService: 'DELIVERY',
      };

      const result = await server.executeOperation(
        {
          query: registerMutation,
          variables: {
            input: newLead,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        const registeredLead = result.body.singleResult.data?.register as Lead;
        expect(registeredLead).toBeDefined();

        Object.entries(newLead).forEach(([key, value]) => {
          expect(registeredLead[key as keyof Lead]).toBe(value);
        });
      }
    });

    it('should return error code of "VALIDATION_ERROR" when invalid parameters is provided', async () => {
      const invalidLead = {
        name: '',
        email: 'test-gmail.com',
        mobile: '123TEST',
        postcode: '1234[=+|',
        preferredService: 'DELIVERY',
      };

      const result = await server.executeOperation(
        {
          query: registerMutation,
          variables: {
            input: invalidLead,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'VALIDATION_ERROR',
        );
      }
    });

    it('should return error code of "BAD_USER_INPUT" when invalid "preferredService" is provided', async () => {
      const invalidLead = {
        name: 'test',
        email: 'test@gmail.com',
        mobile: '1234',
        postcode: '1234',
        preferredService: 'NOT_DELIVERY',
      };

      const result = await server.executeOperation(
        {
          query: registerMutation,
          variables: {
            input: invalidLead,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'BAD_USER_INPUT',
        );
      }
    });

    it('should return error code of "BAD_REQUEST" error when registering with duplicate email', async () => {
      const duplicateEmailLead = {
        name: 'Duplicate Email',
        email: 'john@example.com',
        mobile: '8888888888',
        postcode: '1234',
        preferredService: 'DELIVERY',
      };

      const result = await server.executeOperation(
        {
          query: registerMutation,
          variables: {
            input: duplicateEmailLead,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'BAD_REQUEST',
        );
      }
    });

    it('should return error code of "BAD_REQUEST" error when registering with duplicate mobile', async () => {
      const duplicateMobileLead = {
        name: 'Duplicate Mobile',
        email: 'duplicate@example.com',
        mobile: '1234567890',
        postcode: '1234',
        preferredService: 'DELIVERY',
      };

      const result = await server.executeOperation(
        {
          query: registerMutation,
          variables: {
            input: duplicateMobileLead,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0].extensions?.code).toBe(
          'BAD_REQUEST',
        );
      }
    });

    it('should trim whitespace from "name", "email", "mobile", and "postcode"', async () => {
      const leadWithWhitespace = {
        name: '  Trim Test  ',
        email: '  trim@example.com  ',
        mobile: '  7777777777  ',
        postcode: ' 1234  ',
        preferredService: 'DELIVERY',
      };

      const result = await server.executeOperation(
        {
          query: registerMutation,
          variables: {
            input: leadWithWhitespace,
          },
        },
        { contextValue: { prisma } },
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        const registeredLead = result.body.singleResult.data?.register as Lead;

        Object.entries(leadWithWhitespace).forEach(([key, value]) => {
          expect(registeredLead[key as keyof Lead]).toBe(value.trim());
        });
      }
    });
  });
});
