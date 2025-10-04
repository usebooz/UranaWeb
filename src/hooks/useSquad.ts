import {
  QueryRef,
  skipToken,
  useLoadableQuery,
  useReadQuery,
  useSuspenseQuery,
} from '@apollo/client/react';
import {
  FantasyRatingEntityType,
  GetLeagueSquadsDocument,
  GetLeagueSquadsWithCurrentTourInfoDocument,
  GetSquadTourInfoDocument,
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
} from '@/gql/generated/graphql';
import { useMemo } from 'react';
import { useContextLeague } from './useLeague';
import { useContextTour, useIsTourCurrent } from './useTour';
import { TourService } from '@/services';

/**
 * Hook for fetching league squads data with suspense.
 * Fetches basic squad information for league rating display.
 *
 * @param leagueId - The league identifier
 * @param entityType - Type of rating entity (TOURNAMENT or LEAGUE)
 * @param entityId - ID of the rating entity
 * @returns Array of league squads or empty array
 */
export const useSuspenseLeagueSquads = (
  leagueId?: string,
  entityType?: FantasyRatingEntityType,
  entityId?: string
) => {
  const { data } = useSuspenseQuery(
    GetLeagueSquadsDocument,
    leagueId && entityType && entityId
      ? { variables: { leagueId, entityType, entityId } }
      : skipToken
  );

  return data?.fantasyQueries.rating.squads?.list || [];
};

/**
 * Hook for fetching league squads with current tour information.
 * Includes detailed tour data for each squad, used for current tour analysis.
 *
 * @param leagueId - The league identifier
 * @param entityType - Type of rating entity (TOURNAMENT or LEAGUE)
 * @param entityId - ID of the rating entity
 * @returns Array of league squads with current tour info or empty array
 */
export const useSuspenseLeagueSquadsWithCurrentTourInfo = (
  leagueId?: string,
  entityType?: FantasyRatingEntityType,
  entityId?: string
) => {
  const { data } = useSuspenseQuery(
    GetLeagueSquadsWithCurrentTourInfoDocument,
    leagueId && entityType && entityId
      ? { variables: { leagueId, entityType, entityId } }
      : skipToken
  );

  return (
    data?.fantasyQueries.rating.squads?.list.map(squadWithInfo => {
      const { scoreInfo, squad } = squadWithInfo;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { currentTourInfo, ...squadWithoutInfo } = squad;
      return { scoreInfo, squad: squadWithoutInfo };
    }) || []
  );
};

/**
 * Hook for getting squads from current context (league and tour).
 * Automatically selects between basic squads or squads with current tour info
 * based on whether the current tour is active and has score data available.
 *
 * @returns Array of league squads (with or without current tour info)
 */
export const useContextSquads = () => {
  const league = useContextLeague();
  const tour = useContextTour();
  const isTourCurrent = useIsTourCurrent();
  const isTourScoreAvailable = useMemo(
    () => TourService.isScoreAvailable(tour),
    [tour?.status]
  );

  const entityType = isTourScoreAvailable
    ? FantasyRatingEntityType.Tour
    : FantasyRatingEntityType.Season;
  const entityId = isTourScoreAvailable ? tour.id : league.season.id;
  const squads = useSuspenseLeagueSquads(
    !isTourCurrent ? league.id : undefined,
    !isTourCurrent ? entityType : undefined,
    !isTourCurrent ? entityId : undefined
  );
  const squadsWithCurrentTourInfo = useSuspenseLeagueSquadsWithCurrentTourInfo(
    isTourCurrent ? league.id : undefined,
    isTourCurrent ? entityType : undefined,
    isTourCurrent ? entityId : undefined
  );
  return squadsWithCurrentTourInfo.length ? squadsWithCurrentTourInfo : squads;
};

/**
 * Hook for creating a loadable query for squad tour information.
 * Returns a loadable query that can be triggered manually to fetch squad tour data.
 *
 * @returns Loadable query reference for squad tour info
 */
export const useLoadableSquadTourInfo = () => {
  return useLoadableQuery(GetSquadTourInfoDocument);
};
/**
 * Hook for reading squad tour information from a query reference.
 * Extracts squad tour info data from an already-executed query.
 *
 * @param queryRef - Query reference containing squad tour info data
 * @returns Squad tour information data
 */
export const useReadSquadTourInfo = (
  queryRef: QueryRef<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>
) => {
  const { data } = useReadQuery(queryRef);
  return data.fantasyQueries.squadTourInfo;
};
