export const resolvers = {
  Query: {
    users: () => {
      return [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ];
    },
  },
};
