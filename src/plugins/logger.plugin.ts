import {
  BaseContext,
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContextWillSendResponse,
} from '@apollo/server';

function getTimestamp() {
  const date = new Date();

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export const loggerPlugin: ApolloServerPlugin = {
  async requestDidStart<TContext extends BaseContext>(
    requestContext: GraphQLRequestContext<TContext>,
  ): Promise<GraphQLRequestListener<TContext>> {
    const { request } = requestContext;
    const startTime = Date.now();

    console.log('\nGraphQL Request Started');
    console.log(`Time: ${getTimestamp()}`);

    console.log(`Query: ${request.operationName}`);

    return {
      async willSendResponse(
        responseContext: GraphQLRequestContextWillSendResponse<TContext>,
      ): Promise<void> {
        const duration = Date.now() - startTime;
        console.log(`\nResponse sent (${duration}ms)`);
      },

      async didEncounterErrors(
        errorContext: GraphQLRequestContextDidEncounterErrors<TContext>,
      ): Promise<void> {
        console.error('\nErrors Encountered');

        errorContext.errors.forEach((error, i) => {
          console.error(`Error ${i + 1}:`, error.message);
          if (error.path) console.error('Path:', error.path);
          if (error.stack) console.error('Stack:', error.stack);
        });
      },
    };
  },
};
