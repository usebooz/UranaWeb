import type { QueryHookOptions } from '@apollo/client';
import { useSportsQuery } from '@/hooks/useSports';
import {
  Scalars,
  GetTourDocument,
  GetTourQuery,
  GetTourQueryVariables,
  GetTourMatchesQuery,
  GetTourMatchesDocument,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import type { Tour, TourMatch } from '@/gql';

/**
 * Hook for getting tour by ID
 * @param id - Tour ID
 * @param options - additional options for Apollo Client
 */
export const useTourById = (
  id: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetTourQuery, GetTourQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<typeof useSportsQuery<GetTourQuery, GetTourQueryVariables>>,
  'data'
> & {
  data?: Tour;
} => {
  const result = useSportsQuery(GetTourDocument, {
    ...options,
    variables: {
      id,
    },
  });

  return {
    ...result,
    data: result.data?.fantasyQueries?.tour || null,
  };
};

/**
 * Hook for getting tour matches
 * @param id - Tour ID
 * @param options - additional options for Apollo Client
 */
export const useTourMatches = (
  id: Scalars['ID']['input'],
  options?: Omit<
    QueryHookOptions<GetTourMatchesQuery, GetTourMatchesQueryVariables>,
    'variables'
  >
): Omit<
  ReturnType<
    typeof useSportsQuery<GetTourMatchesQuery, GetTourMatchesQueryVariables>
  >,
  'data'
> & {
  data?: TourMatch[];
} => {
  const result = useSportsQuery(GetTourMatchesDocument, {
    ...options,
    variables: {
      id,
    },
  });

  return {
    ...result,
    data: result.data?.fantasyQueries?.tour?.matches || [],
  };
};
