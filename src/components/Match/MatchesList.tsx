import { type FC } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';
import { QueryRef } from '@apollo/client';
import {
  GetTourMatchesQuery,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import { useReadTourMatches } from '@/hooks';
import { MatchItem } from './Match';

/**
 * Props for the Matches component
 */
interface MatchesListProps {
  /**  */
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>;
}

/**
 *
 *
 */
export const MatchesList: FC<MatchesListProps> = ({ queryRef }) => {
  const matches = useReadTourMatches(queryRef);
  if (!matches || matches.length === 0) {
    return <Placeholder header="Матчи не найдены" />;
  }

  return matches.map(match => <MatchItem key={match.id} match={match} />);
};
