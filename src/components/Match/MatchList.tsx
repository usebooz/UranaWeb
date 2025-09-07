import { ElementType, type FC } from 'react';
import { Placeholder, Spinner } from '@telegram-apps/telegram-ui';

import { MatchItem } from './Match';
import { type TourMatch } from '@/gql';

/**
 * Props for the Matches component
 */
interface MatchListProps {
  /** Array of matches for the tour */
  matches?: TourMatch[];
  /** Loading states */
  matchesLoading: boolean;
  /** */
  Component?: ElementType;
}

/**
 * Matches component for displaying list of tour matches
 * Renders all matches or shows placeholder if no matches found
 */
export const MatchList: FC<MatchListProps> = ({
  matches,
  matchesLoading,
  Component,
}) => {
  if (matchesLoading) {
    return (
      <Placeholder>
        <Spinner size="m" />
      </Placeholder>
    );
  }

  if (!matches || matches.length === 0) {
    return <Placeholder header="Матчи не найдены" />;
  }

  const Container = Component || (({ children }) => <>{children}</>);
  return (
    <Container>
      {matches.map(match => (
        <MatchItem key={match.id} match={match} />
      ))}
    </Container>
  );
};
