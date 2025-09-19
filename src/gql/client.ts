import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

// Apollo Client for Sports.ru API (encapsulated in hook)
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_SPORTS_API_URL as string,
});

export const sportsClient = new ApolloClient({
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
