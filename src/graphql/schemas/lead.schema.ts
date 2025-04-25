import gql from 'graphql-tag';

export const typeDefs = gql`
  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    lead(id: ID!): Lead
    leads(id: ID): [Lead!]!
  }
`;
