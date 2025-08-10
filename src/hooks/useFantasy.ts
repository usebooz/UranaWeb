import type { QueryHookOptions } from '@apollo/client';
import { TOURNAMENT_QUERY } from '@/gql/queries/tournament.query';
import { useSportsQuery } from '@/hooks/useSportsru';
import {
  FantasyIdSource,
  type TournamentQuery,
  type TournamentQueryVariables,
} from '@/gql/generated/graphql';

/**
 * Hook для получения турнира с автоматическим определением source
 * @param webname Webname турнира
 * @param options Дополнительные опции Apollo Query
 */
export const useTournamentByWebname = (
  webname: string,
  options?: Omit<
    QueryHookOptions<TournamentQuery, TournamentQueryVariables>,
    'variables'
  >
) => {
  const variables = {
    source: FantasyIdSource.Hru,
    id: webname,
  };

  return useSportsQuery<TournamentQuery, TournamentQueryVariables>(
    TOURNAMENT_QUERY,
    {
      variables,
      ...options,
    }
  );
};
