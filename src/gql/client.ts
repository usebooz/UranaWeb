import {
  ApolloClient,
  createHttpLink,
  FieldPolicy,
  InMemoryCache,
} from '@apollo/client';
import { SquadTourInfo } from '.';
import { GetSquadTourInfoQueryVariables } from './generated/graphql';

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
      FantasyQueries: {
        fields: {
          squadTourInfo: {
            read(existing, options) {
              if (existing) {
                return existing;
              }

              const { tourId, squadId } =
                options.variables as GetSquadTourInfoQueryVariables;
              const squadRef = options.toReference({
                __typename: 'FantasySquad',
                id: squadId,
              });
              const squadCurrentTourInfo = options.readField<SquadTourInfo>(
                'currentTourInfo',
                squadRef
              );
              const currentTourId = options.readField<string>(
                'id',
                squadCurrentTourInfo?.tour
              );
              if (currentTourId === tourId) {
                return squadCurrentTourInfo;
              }

              return undefined;
            },
          } satisfies FieldPolicy<SquadTourInfo>,
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
