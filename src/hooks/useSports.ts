import {
  useQuery,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  type QueryHookOptions,
  type DocumentNode,
  type OperationVariables,
} from '@apollo/client';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';

// Apollo Client for Sports.ru API (encapsulated in hook)
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_SPORTS_API_URL as string,
});

const sportsClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          fantasyQueries: {
            // Custom merge function for safe FantasyQueries combining
            merge(existing, incoming) {
              // Merge fields from existing and incoming
              return {
                ...existing,
                ...incoming,
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

/**
 * Base hook for executing queries to Sports.ru API
 * Automatically uses sportsClient
 */
export const useSportsQuery = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
) => {
  return useQuery<TData, TVariables>(query, {
    client: sportsClient,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    ...options,
  });
};
