import { useMemo, type FC } from 'react';
import { QueryRef } from '@apollo/client';
import {
  GetTourMatchesQuery,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import { useReadTourMatches } from '@/hooks';
import { MatchService } from '@/services';
import { Badge } from '@telegram-apps/telegram-ui';

/**
 * Props for MatchesStatus component.
 */
interface MatchesStatusProps {
  /** Apollo Client query reference for tour matches */
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>;
}

/**
 * Component that displays a badge showing the count of started matches.
 * Shows the number of matches that have begun (live or finished) in the current tour.
 *
 * @param props - The component props
 * @returns Badge with count of started matches, or null if no matches started
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
