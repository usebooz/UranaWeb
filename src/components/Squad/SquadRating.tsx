import { type FC } from 'react';
import { Spinner, Placeholder } from '@telegram-apps/telegram-ui';
import { SquadList, SquadRatingHeader } from '@/components/Squad';
import type { LeagueSquad, SquadTourInfo, Tour, TourMatch } from '@/gql';

/**
 * Props for the SquadTable component
 */
interface SquadRatingProps {
  /** Array of squads with rating information */
  squads?: LeagueSquad[];
  /** Array of squad tour info with players data */
  squadsCurrentTourInfo?: SquadTourInfo[];
  /** Current tour data */
  tour?: Tour;
  /** Array of matches for the tour */
  currentMatches?: TourMatch[];
  /** Whether tour is current */
  isTourCurrent: boolean;
  /** Loading states */
  squadsLoading: boolean;
}

/**
 * SquadTable component for displaying squads table with header and list
 * Renders table header with column titles and squads list
 */
export const SquadRating: FC<SquadRatingProps> = ({
  squads,
  squadsCurrentTourInfo,
  tour,
  currentMatches,
  isTourCurrent,
  squadsLoading,
}) => {
  if (squadsLoading) {
    return (
      <Placeholder>
        <Spinner size="m" />
      </Placeholder>
    );
  }

  return (
    <>
      <SquadRatingHeader squads={squads} tour={tour} />
      <SquadList
        squads={squads}
        squadsCurrentTourInfo={squadsCurrentTourInfo}
        tour={tour}
        currentMatches={currentMatches}
        isTourCurrent={isTourCurrent}
      />
    </>
  );
};
