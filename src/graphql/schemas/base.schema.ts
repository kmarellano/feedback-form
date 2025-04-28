import gql from 'graphql-tag';

export const typeDefs = gql`
  enum OrderBy {
    ASC
    DESC
  }

  input PaginationParams {
    paginate: Boolean
    page: Int
    limit: Int
  }
`;
