import { useMemo, type FC } from 'react';
import { QueryRef } from '@apollo/client';
import {
  GetTourMatchesQuery,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import { useReadTourMatches } from '@/hooks';
import { MatchService } from '@/services';
import { Badge } from '@telegram-apps/telegram-ui';

interface MatchesStatusProps {
  /**
   *
   */
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>;
}

/**
 *
 * @param props
 * @returns
 */
export const MatchesStatus: FC<MatchesStatusProps> = ({ queryRef }) => {
  const matches = useReadTourMatches(queryRef);
  const matchesStartedCount = useMemo(
    () => MatchService.filterMatchesStarted(matches)?.length.toString(),
    [matches]
  );
  return (
    matchesStartedCount && <Badge type="number">{matchesStartedCount}</Badge>
  );
};
