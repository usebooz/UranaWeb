import {
  QueryRef,
  skipToken,
  useLoadableQuery,
  useReadQuery,
  useSuspenseQuery,
} from '@apollo/client';
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
 *
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
 *
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
 *
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
