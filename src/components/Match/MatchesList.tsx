import { type FC } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';
import { QueryRef } from '@apollo/client/react';
import {
  GetTourMatchesQuery,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import { useReadTourMatches } from '@/hooks';
import { MatchItem } from './Match';

/**
 * Props for MatchesList component.
 */
interface MatchesListProps {
  /** Apollo Client query reference for tour matches */
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>;
}

/**
 * Component that displays a list of matches for a tour.
 * Shows each match as a MatchItem or a placeholder if no matches are found.
 * Used to render the complete matches listing for tour details.
 *
 * @param props - The component props
 * @returns List of match items or placeholder for empty state
 */
export const MatchesList: FC<MatchesListProps> = ({ queryRef }) => {
  const matches = useReadTourMatches(queryRef);
  if (!matches || matches.length === 0) {
    return <Placeholder header="Матчи не найдены" />;
  }

  return matches.map(match => <MatchItem key={match.id} match={match} />);
};
