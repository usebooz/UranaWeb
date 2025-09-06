import type { QueryHookOptions } from '@apollo/client';
import { useSportsQuery } from '@/hooks/useSports';
import {
  Scalars,
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
  GetSquadTourInfoDocument,
} from '@/gql/generated/graphql';
import type { SquadTourInfo } from '@/gql';

/**
 * Hook for getting squad tour info
 * @param tourId - Tour ID
 * @param squadId - Squad ID
 * @param options - additional options for Apollo Client
 */
export const useLeagueSquadTourInfo = (
  tourId: Scalars['ID']['input'],
  squadId: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>
  >,
  'data'
> & {
  data?: SquadTourInfo;
} => {
  const result = useSportsQuery(GetSquadTourInfoDocument, {
    ...options,
    variables: {
      tourId,
      squadId,
    },
  });

  return {
    ...result,
    data: {
      id: squadId,
      tourInfo: result.data?.fantasyQueries.squadTourInfo,
    },
  };
};
