import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GetLeagueDocument } from '@/gql/generated/graphql';
import { useParams } from 'react-router-dom';
import { useContextTournament } from './useTournament';
import { LeagueService } from '@/services';
import { useContext } from 'react';
import { LeagueContext } from '@/components/League';

/**
 *
 */
export const useLeagueParam = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  return leagueId;
};

/**
 *
 * @param id
 */
export const useSuspenseLeague = (id?: string) => {
  const { data, error } = useSuspenseQuery(
    GetLeagueDocument,
    id ? { variables: { id } } : skipToken
  );
  if (error) {
    throw error;
  }
  return data?.fantasyQueries?.league || null;
};

/**
 *
 */
export const useContextLeague = () => {
  const leagueId = useContext(LeagueContext);
  const league = useSuspenseLeague(leagueId);
  const tournament = useContextTournament();
  if (
    !league ||
    !LeagueService.isFromCurrentSeason(league, tournament.currentSeason?.id)
  ) {
    throw new Error('Лига не найдена');
  }
  return league;
};
