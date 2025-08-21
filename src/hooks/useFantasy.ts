import type { QueryHookOptions } from '@apollo/client';
import { useSportsQuery } from '@/hooks/useSports';
import {
  Scalars,
  type GetLeagueQuery,
  type GetLeagueQueryVariables,
  GetLeagueDocument,
  GetTourDocument,
  GetTourQuery,
  GetTourQueryVariables,
  GetLeagueSquadsDocument,
  GetLeagueSquadsQuery,
  GetLeagueSquadsQueryVariables,
  FantasyRatingEntityType,
  GetLeagueSquadsCurrentPlayersQuery,
  GetLeagueSquadsCurrentPlayersQueryVariables,
  GetLeagueSquadsCurrentPlayersDocument,
  GetTourMatchesQuery,
  GetTourMatchesDocument,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import type {
  League,
  LeagueSquads,
  LeagueSquadsPlayers,
  Tour,
  TourMatches,
} from '@/gql';

/**
 * Хук для получения лиги по ID
 * @param id - ID лиги
 * @param options - дополнительные опции для Apollo Client
 */
export const useLeagueById = (
  id: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetLeagueQuery, GetLeagueQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<typeof useSportsQuery<GetLeagueQuery, GetLeagueQueryVariables>>,
  'data'
> & {
  data?: League;
} => {
  const result = useSportsQuery(GetLeagueDocument, {
    ...options,
    variables: {
      id,
    },
  });

  return {
    ...result,
    data: result.data?.fantasyQueries?.league || null,
  };
};

export const useTourById = (
  id: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetTourQuery, GetTourQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<typeof useSportsQuery<GetTourQuery, GetTourQueryVariables>>,
  'data'
> & {
  data?: Tour;
} => {
  const result = useSportsQuery(GetTourDocument, {
    ...options,
    variables: {
      id,
    },
  });

  return {
    ...result,
    data: result.data?.fantasyQueries?.tour || null,
  };
};

export const useTourMatches = (
  id: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetTourMatchesQuery, GetTourMatchesQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<GetTourMatchesQuery, GetTourMatchesQueryVariables>
  >,
  'data'
> & {
  data?: TourMatches;
} => {
  const result = useSportsQuery(GetTourMatchesDocument, {
    ...options,
    variables: {
      id,
    },
  });

  return {
    ...result,
    data: result.data?.fantasyQueries?.tour?.matches || [],
  };
};

export const useLeagueSquadsWithTourRating = (
  leagueId: Scalars['ID']['input'],
  tourId: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetLeagueSquadsQuery, GetLeagueSquadsQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<GetLeagueSquadsQuery, GetLeagueSquadsQueryVariables>
  >,
  'data'
> & {
  data?: LeagueSquads;
} => {
  const result = useSportsQuery(GetLeagueSquadsDocument, {
    ...options,
    variables: {
      leagueId,
      entityType: FantasyRatingEntityType.Tour,
      entityId: tourId,
    },
  });

  return {
    ...result,
    data:
      result.data?.fantasyQueries?.rating?.squads?.list
        ?.slice()
        .sort(
          (a, b) => a.scoreInfo.placeAfterTour - b.scoreInfo.placeAfterTour
        ) || [],
  };
};

export const useLeagueSquadsWithSeasonRating = (
  leagueId: Scalars['ID']['input'],
  seasonId: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetLeagueSquadsQuery, GetLeagueSquadsQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<GetLeagueSquadsQuery, GetLeagueSquadsQueryVariables>
  >,
  'data'
> & {
  data?: LeagueSquads;
} => {
  const result = useSportsQuery(GetLeagueSquadsDocument, {
    ...options,
    variables: {
      leagueId,
      entityType: FantasyRatingEntityType.Season,
      entityId: seasonId,
    },
  });

  return {
    ...result,
    data: result.data?.fantasyQueries?.rating?.squads?.list || [],
  };
};

export const useLeagueSquadsCurrentPlayers = (
  leagueId: Scalars['ID']['input'],
  seasonId: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<
      GetLeagueSquadsCurrentPlayersQuery,
      GetLeagueSquadsCurrentPlayersQueryVariables
    >,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<
      GetLeagueSquadsCurrentPlayersQuery,
      GetLeagueSquadsCurrentPlayersQueryVariables
    >
  >,
  'data'
> & {
  data?: LeagueSquadsPlayers;
} => {
  const result = useSportsQuery(GetLeagueSquadsCurrentPlayersDocument, {
    ...options,
    variables: {
      leagueId,
      seasonId,
    },
  });

  return {
    ...result,
    data: result.data?.fantasyQueries?.rating?.squads?.list || [],
  };
};
