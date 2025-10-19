import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { GetLeagueDocument } from '@/gql/generated/graphql';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContextTournament } from './useTournament';
import { LeagueService } from '@/services';
import { useContext, useEffect } from 'react';
import { LeagueContext } from '@/components/League';
import { useLaunchParams } from '@telegram-apps/sdk-react';

/**
 * Hook for extracting league ID from URL parameters.
 *
 * @returns League ID from route parameters
 */
export const useLeagueParam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const launchParams = useLaunchParams();
  const { leagueId } = useParams<{ leagueId: string }>();

  useEffect(() => {
    if (!leagueId && launchParams.tgWebAppStartParam) {
      navigate(location.pathname + launchParams.tgWebAppStartParam, {
        replace: true,
      }) as void;
    }
  }, [leagueId, launchParams.tgWebAppStartParam, location.pathname, navigate]);

  return leagueId || launchParams.tgWebAppStartParam;
};

/**
 * Hook for fetching league data with suspense.
 * Throws error if the query fails, enabling error boundaries to catch it.
 *
 * @param id - The league identifier
 * @returns League data or null if not found
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
 * Hook for getting league data from context with validation.
 * Ensures the league belongs to the current tournament season.
 *
 * @throws {Error} When league is not found or doesn't belong to current season
 * @returns League data from context
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
