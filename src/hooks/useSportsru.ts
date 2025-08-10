import {
  useQuery,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  type QueryHookOptions,
  type DocumentNode,
  type OperationVariables,
} from '@apollo/client';

// Apollo Client для Sports.ru API (инкапсулирован в хуке)
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_SPORTS_API_URL as string,
});

const sportsClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Здесь можно настроить кеширование для конкретных типов
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
 * Базовый хук для выполнения запросов к Sports.ru API
 * Автоматически использует sportsClient
 */
export const useSportsQuery = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
) => {
  return useQuery<TData, TVariables>(query, {
    client: sportsClient,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    ...options,
  });
};
