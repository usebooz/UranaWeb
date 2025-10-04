import {
  ApolloClient,
  createHttpLink,
  FieldPolicy,
  InMemoryCache,
} from '@apollo/client';
import { LeagueSquadWithCurrentTourInfo, SquadTourInfo } from '.';
import {
  FantasyRatingEntityType,
  FantasyTourStatus,
  GetLeagueSquadsQueryVariables,
  GetSquadTourInfoQueryVariables,
} from './generated/graphql';
import { PlayerCacheService, SquadCacheService } from '@/services';

// Apollo Client for Sports.ru API (encapsulated in hook)
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_SPORTS_API_URL as string,
});

export const sportsClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      FantasySquad: {
        fields: {
          currentTourInfo: {
            merge(existing, incoming, options) {
              if (existing || !incoming) {
                return existing;
              }
              const tourInfo = structuredClone(incoming) as SquadTourInfo;

              // If the tour is in progress, recalculate players' live scores
              const tourStatus = options.readField<FantasyTourStatus>(
                'status',
                tourInfo?.tour
              );
              if (tourStatus === FantasyTourStatus.InProgress) {
                PlayerCacheService.initialize(options);
                PlayerCacheService.recalculateSquadPlayersLiveScore(
                  tourInfo?.players || []
                );
                PlayerCacheService.initialize();
              }

              return tourInfo;
            },
          } satisfies FieldPolicy<SquadTourInfo>,
        },
      },
      FantasySquadRatingPage: {
        fields: {
          list: {
            merge(existing, incoming, options) {
              if (existing?.length || !incoming.length) {
                return existing || [];
              }
              const { entityType, entityId } =
                options.variables as GetLeagueSquadsQueryVariables;
              let leagueSquads = structuredClone(
                incoming
              ) as LeagueSquadWithCurrentTourInfo[];

              // If the tour is in progress, recalculate squads' live scores
              if (entityType === FantasyRatingEntityType.Tour) {
                const tourRef = options.toReference({
                  __typename: 'FantasyTour',
                  id: entityId,
                });
                const tourStatus = options.readField<FantasyTourStatus>(
                  'status',
                  tourRef
                );
                if (tourStatus === FantasyTourStatus.InProgress) {
                  SquadCacheService.initialize(options);
                  SquadCacheService.recalculateSquadsLiveScore(leagueSquads);
                  SquadCacheService.initialize();
                }
              }

              // Always sort th squads by season score
              return entityType === FantasyRatingEntityType.Tour
                ? leagueSquads.sort(
                    (a, b) =>
                      a.scoreInfo.placeAfterTour - b.scoreInfo.placeAfterTour
                  )
                : leagueSquads.sort(
                    (a, b) => a.scoreInfo.place - b.scoreInfo.place
                  );
            },
          } satisfies FieldPolicy<LeagueSquadWithCurrentTourInfo[]>,
        },
      },
      FantasyQueries: {
        fields: {
          squadTourInfo: {
            read(existing, options) {
              // Already in cache
              if (existing) {
                return existing;
              }
              const { tourId, squadId } =
                options.variables as GetSquadTourInfoQueryVariables;

              // For the current tour, the data must already be loaded
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

              // In other cases, send a request
              return undefined;
            },
          } satisfies FieldPolicy<SquadTourInfo>,
        },
      },
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
