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
  GetLeagueSquadsCurrentTourInfoQuery,
  GetLeagueSquadsCurrentTourInfoQueryVariables,
  GetLeagueSquadsCurrentTourInfoDocument,
  GetTourMatchesQuery,
  GetTourMatchesDocument,
  GetTourMatchesQueryVariables,
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
  GetSquadTourInfoDocument,
} from '@/gql/generated/graphql';
import type {
  League,
  LeagueSquad,
  SquadTourInfo,
  Tour,
  TourMatch,
} from '@/gql';

/**
 * Hook for getting league by ID
 * @param id - League ID
 * @param options - additional options for Apollo Client
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

/**
 * Hook for getting tour by ID
 * @param id - Tour ID
 * @param options - additional options for Apollo Client
 */
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

/**
 * Hook for getting tour matches
 * @param id - Tour ID
 * @param options - additional options for Apollo Client
 */
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
  data?: TourMatch[];
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

/**
 * Hook for getting league squads with tour rating
 * @param leagueId - League ID
 * @param tourId - Tour ID
 * @param options - additional options for Apollo Client
 */
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
  data?: LeagueSquad[];
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

/**
 * Hook for getting league squads with season rating
 * @param leagueId - League ID
 * @param seasonId - Season ID
 * @param options - additional options for Apollo Client
 */
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
  data?: LeagueSquad[];
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

/**
 *
 * @param leagueId - League ID
 * @param seasonId - Season ID
 * @param options - additional options for Apollo Client
 */
export const useLeagueSquadsCurrentTourInfo = (
  leagueId: Scalars['ID']['input'],
  seasonId: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<
      GetLeagueSquadsCurrentTourInfoQuery,
      GetLeagueSquadsCurrentTourInfoQueryVariables
    >,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<
      GetLeagueSquadsCurrentTourInfoQuery,
      GetLeagueSquadsCurrentTourInfoQueryVariables
    >
  >,
  'data'
> & {
  data?: SquadTourInfo[];
} => {
  const result = useSportsQuery(GetLeagueSquadsCurrentTourInfoDocument, {
    ...options,
    variables: {
      leagueId,
      seasonId,
    },
  });

  return {
    ...result,
    data:
      result.data?.fantasyQueries?.rating?.squads?.list.map(s => ({
        id: s.squad.id,
        tourInfo: s.squad.currentTourInfo,
      })) || [],
  };
};

/**
 *
 * @param tourId - Tour ID
 * @param squadId - Squad ID
 * @param options - additional options for Apollo Client
 */
export const useLeagueSquadTourInfo = (
  tourId: Scalars['ID']['input'],
  squadId: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>
  >,
  'data'
> & {
  data?: SquadTourInfo;
} => {
  const result = useSportsQuery(GetSquadTourInfoDocument, {
    ...options,
    variables: {
      tourId,
      squadId,
    },
  });

  return {
    ...result,
    data: {
      id: squadId,
      tourInfo: result.data?.fantasyQueries.squadTourInfo,
    },
  };
};
