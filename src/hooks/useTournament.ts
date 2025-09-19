import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GetTournamentDocument } from '@/gql/generated/graphql';
import { useContext, useMemo } from 'react';
import { TournamentContext } from '@/components/Tournament';
import { TournamentService } from '@/services';

/**
 *
 * @param webname
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
 *
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
 *
 */
export const useCurrentTourId = () => {
  const tournament = useContextTournament();
  return useMemo(
    () => TournamentService.getCurrentTourId(tournament),
    [tournament]
  );
};
