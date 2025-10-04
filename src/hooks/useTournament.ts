import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { GetTournamentDocument } from '@/gql/generated/graphql';
import { useContext, useMemo } from 'react';
import { TournamentContext } from '@/components/Tournament';
import { TournamentService } from '@/services';

/**
 * Hook for fetching tournament data with suspense.
 * Throws error if the query fails, enabling error boundaries to catch it.
 *
 * @param webname - The tournament webname identifier
 * @returns Tournament data or null if not found
 */
export const useSuspenseTournament = (webname?: string) => {
  const { data, error } = useSuspenseQuery(
    GetTournamentDocument,
    webname ? { variables: { id: webname } } : skipToken
  );
  if (error) {
    throw error;
  }
  return data?.fantasyQueries?.tournament || null;
};

/**
 * Hook for getting tournament data from context.
 * Requires tournament webname to be provided via TournamentContext.
 *
 * @throws {Error} When tournament is not found
 * @returns Tournament data from context
 */
export const useContextTournament = () => {
  const webname = useContext(TournamentContext);
  const tournament = useSuspenseTournament(webname);
  if (!tournament) {
    throw new Error('Турнамент не найден');
  }
  return tournament;
};

/**
 * Hook for getting the current tour ID from tournament context.
 * Uses TournamentService to determine the current tour based on tournament state.
 *
 * @returns The current tour ID or undefined if not available
 */
export const useCurrentTourId = () => {
  const tournament = useContextTournament();
  return useMemo(
    () => TournamentService.getCurrentTourId(tournament),
    [tournament]
  );
};
