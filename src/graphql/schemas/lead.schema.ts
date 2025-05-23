import gql from 'graphql-tag';

export const typeDefs = gql`
  enum ServiceType {
    DELIVERY
    PAYMENT
    PICKUP
  }

  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    preferredService: ServiceType!
    createdAt: String!
    updatedAt: String!
  }

  input LeadsParams {
    name: String
    postcode: String
    preferredService: ServiceType
    createdAt: String
  }

  input LeadsOrderParams {
    name: OrderBy
    postcode: OrderBy
    preferredService: OrderBy
    createdAt: OrderBy
  }

  type Query {
    leads(
      filterBy: LeadsParams
      pagination: PaginationParams
      orderBy: LeadsOrderParams
    ): [Lead!]!
    lead(id: ID, email: String, mobile: String): Lead!
  }

  input RegisterInput {
    name: String
    email: String!
    mobile: String!
    postcode: String!
    preferredService: ServiceType!
  }

  input UpdateLeadInput {
    name: String
    email: String
    mobile: String
    postcode: String
    preferredService: ServiceType
  }

  type Mutation {
    register(input: RegisterInput!): Lead!
    updateLead(id: ID!, input: UpdateLeadInput): Lead!
  }
`;
