import {
  QueryRef,
  skipToken,
  useBackgroundQuery,
  useLoadableQuery,
  useReadQuery,
  useSuspenseQuery,
} from '@apollo/client';
import {
  GetTourDocument,
  GetTourMatchesDocument,
  GetTourMatchesQueryVariables,
  GetTourMatchesQuery,
} from '@/gql/generated/graphql';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrentTourId, useContextTournament } from './useTournament';
import { TourService } from '@/services';
import { TourContext } from '@/components/Tour';

/**
 *
 *
 */
export const useUpdateTourParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateTourParam = useCallback(
    (newTourId: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tourId', newTourId);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return updateTourParam;
};
/**
 *
 *
 */
export const useGetTourParam = () => {
  const [searchParams] = useSearchParams();
  const updateTourParam = useUpdateTourParam();

  const tourId = searchParams.get('tourId');
  const currentTourId = useCurrentTourId();

  useEffect(() => {
    if (!tourId && currentTourId) {
      updateTourParam(currentTourId);
    }
  }, [tourId, currentTourId, updateTourParam]);

  return tourId || currentTourId;
};

/**
 *
 * @param id
 */
const useSuspenseTour = (id?: string) => {
  const { data, error } = useSuspenseQuery(
    GetTourDocument,
    id ? { variables: { id } } : skipToken
  );
  if (error) {
    throw error;
  }
  return data?.fantasyQueries?.tour || null;
};
/**
 *
 */
export const useLoadableTourMatches = () => {
  return useLoadableQuery(GetTourMatchesDocument);
};
/**
 *
 */
export const useBackgroundTourMatches = (id?: string) => {
  return useBackgroundQuery(
    GetTourMatchesDocument,
    id ? { variables: { id } } : skipToken
  );
};
/**
 *
 * @param
 */
export const useReadTourMatches = (
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>
) => {
  const { data } = useReadQuery(queryRef);
  return data.fantasyQueries.tour?.matches || [];
};

/**
 *
 */
export const useContextTour = () => {
  const tourId = useContext(TourContext);
  const tour = useSuspenseTour(tourId);
  const tournament = useContextTournament();
  const tours = TourService.filterAvailableTours(
    tournament?.currentSeason?.tours
  );
  //Check if it's available and from current season
  if (!tour || !TourService.isFromCurrentSeason(tour, tours)) {
    throw new Error('Тур не найден');
  }
  return tour;
};
/**
 *
 */
export const useIsTourCurrent = () => {
  const tourId = useContext(TourContext);
  const currentTourId = useCurrentTourId();
  return useMemo(() => tourId === currentTourId, [tourId, currentTourId]);
};
/**
 *
 */
export const useContextCurrentTourMatches = () => {
  //Only for Current Tour
  const tour = useContextTour();
  const isTourCurrent = useIsTourCurrent();
  return useBackgroundTourMatches(isTourCurrent ? tour.id : undefined);
};
