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
 * Hook for updating the tour parameter in the URL search params.
 * Provides a callback function to update the tourId parameter while preserving other params.
 *
 * @returns Function to update the tour parameter
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
 * Hook for getting and managing the tour parameter from URL.
 * Automatically redirects to current tour if no tour is specified in URL.
 *
 * @returns The tour ID from URL parameters or current tour ID
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
 * Hook for fetching tour data with suspense behavior.
 * Throws errors to error boundaries if tour data cannot be loaded.
 *
 * @param id - Tour identifier
 * @returns Tour data or null if not found
 * @throws Error if tour data cannot be loaded
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
 * Hook for creating a loadable query for tour matches.
 * Returns a loadable query that can be triggered manually to fetch tour matches.
 *
 * @returns Loadable query reference for tour matches
 */
export const useLoadableTourMatches = () => {
  return useLoadableQuery(GetTourMatchesDocument);
};
/**
 * Hook for fetching tour matches in the background.
 * Starts a background query for tour matches without blocking the UI.
 *
 * @param id - Tour identifier
 * @returns Background query reference for tour matches
 */
export const useBackgroundTourMatches = (id?: string) => {
  return useBackgroundQuery(
    GetTourMatchesDocument,
    id ? { variables: { id } } : skipToken
  );
};
/**
 * Hook for reading tour matches from a query reference.
 * Extracts tour matches data from an already-executed query.
 *
 * @param queryRef - Query reference containing tour matches data
 * @returns Array of tour matches or empty array
 */
export const useReadTourMatches = (
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>
) => {
  const { data } = useReadQuery(queryRef);
  return data.fantasyQueries.tour?.matches || [];
};

/**
 * Hook for getting tour data from current context.
 * Validates that the tour is available and from the current season.
 *
 * @returns Tour data from context
 * @throws Error if tour is not found or not from current season
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
 * Hook for checking if the current context tour is the active/current tour.
 * Compares the context tour ID with the current tour ID from tournament.
 *
 * @returns True if the context tour is the current active tour
 */
export const useIsTourCurrent = () => {
  const tourId = useContext(TourContext);
  const currentTourId = useCurrentTourId();
  return useMemo(() => tourId === currentTourId, [tourId, currentTourId]);
};
/**
 * Hook for getting matches of the current tour in background.
 * Only fetches matches if the context tour is the current active tour.
 * Used for live match updates without blocking the UI.
 *
 * @returns Background query reference for current tour matches
 */
export const useContextCurrentTourMatches = () => {
  //Only for Current Tour
  const tour = useContextTour();
  const isTourCurrent = useIsTourCurrent();
  return useBackgroundTourMatches(isTourCurrent ? tour.id : undefined);
};
