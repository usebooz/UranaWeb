import { type FC } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { MatchItem } from './Match';
import { type TourMatch } from '@/gql';

/**
 * Props for the Matches component
 */
interface MatchListProps {
  /** Array of matches for the tour */
  matches?: TourMatch[];
}

/**
 * Matches component for displaying list of tour matches
 * Renders all matches or shows placeholder if no matches found
 */
export const MatchList: FC<MatchListProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return <Placeholder header="Матчи не найдены" />;
  }

  return (
    <>
      {matches.map(match => (
        <MatchItem key={match.id} match={match} />
      ))}
    </>
  );
};
