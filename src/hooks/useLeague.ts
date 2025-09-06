import type { QueryHookOptions } from '@apollo/client';
import { useSportsQuery } from '@/hooks/useSports';
import {
  Scalars,
  type GetLeagueQuery,
  type GetLeagueQueryVariables,
  GetLeagueDocument,
  GetLeagueSquadsDocument,
  GetLeagueSquadsQuery,
  GetLeagueSquadsQueryVariables,
  FantasyRatingEntityType,
  GetLeagueSquadsCurrentTourInfoQuery,
  GetLeagueSquadsCurrentTourInfoQueryVariables,
  GetLeagueSquadsCurrentTourInfoDocument,
} from '@/gql/generated/graphql';
import type { League, LeagueSquad, SquadTourInfo } from '@/gql';

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
 * Hook for getting league squads current tour info
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
