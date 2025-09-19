import {
  QueryRef,
  skipToken,
  useLoadableQuery,
  useReadQuery,
  useSuspenseQuery,
} from '@apollo/client';
import {
  GetLeagueSquadsDocument,
  FantasyRatingEntityType,
  GetLeagueSquadsCurrentTourInfoDocument,
  GetSquadTourInfoDocument,
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
} from '@/gql/generated/graphql';
import { useMemo } from 'react';
import { useContextLeague } from './useLeague';
import { useContextTour, useIsTourCurrent } from './useTour';
import { TourService } from '@/services';

/**
 *
 */
export const useSuspenseLeagueSquads = (
  leagueId?: string,
  tourId?: string,
  seasonId?: string
) => {
  const entityType = tourId
    ? FantasyRatingEntityType.Tour
    : FantasyRatingEntityType.Season;
  const entityId = tourId || seasonId;
  const { data } = useSuspenseQuery(
    GetLeagueSquadsDocument,
    leagueId && entityId
      ? { variables: { leagueId, entityType, entityId } }
      : skipToken
  );

  return data?.fantasyQueries.rating.squads?.list || [];
};
/**
 *
 */
export const useSuspenseLeagueSquadsCurrentTourInfo = (
  leagueId?: string,
  seasonId?: string
) => {
  const { data } = useSuspenseQuery(
    GetLeagueSquadsCurrentTourInfoDocument,
    leagueId && seasonId ? { variables: { leagueId, seasonId } } : skipToken
  );

  return (
    data?.fantasyQueries.rating.squads?.list.map(s => ({
      id: s.squad.id,
      tourInfo: s.squad.currentTourInfo,
    })) || []
  );
};

/**
 *
 */
export const useContextSquads = () => {
  const league = useContextLeague();
  const tour = useContextTour();
  const isTourScoreAvailable = useMemo(
    () => TourService.isScoreAvailable(tour),
    [tour?.status]
  );
  return useSuspenseLeagueSquads(
    league.id,
    //Tour Rating
    isTourScoreAvailable ? tour.id : undefined,
    //Season Rating
    !isTourScoreAvailable ? league.season.id : undefined
  );
};
/**
 *
 */
export const useContextSquadsCurrentTourInfo = () => {
  //Only for Current Tour
  const league = useContextLeague();
  const isTourCurrent = useIsTourCurrent();
  useSuspenseLeagueSquadsCurrentTourInfo(
    isTourCurrent ? league.id : undefined,
    isTourCurrent ? league.season.id : undefined
  );
};

/**
 *
 */
export const useLoadableSquadTourInfo = () => {
  return useLoadableQuery(GetSquadTourInfoDocument);
};
/**
 *
 * @param
 */
export const useReadSquadTourInfo = (
  queryRef: QueryRef<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>
) => {
  const { data } = useReadQuery(queryRef);
  return data.fantasyQueries.squadTourInfo;
};
