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

  input PaginationParams {
    paginate: Boolean
    page: Int
    limit: Int
  }

  input LeadsParams {
    name: String
    postcode: String
    preferredService: ServiceType
    createdAt: String
  }

  type Query {
    leads(filterBy: LeadsParams, pagination: PaginationParams): [Lead!]!
    lead(id: ID, email: String, mobile: String): Lead
  }

  input RegisterInput {
    name: String
    email: String!
    mobile: String!
    postcode: String!
    preferredService: ServiceType!
  }

  type Mutation {
    register(input: RegisterInput!): Lead!
  }
`;
