import { useEffect, useState, type FC } from 'react';
import { Accordion, Badge, Skeleton } from '@telegram-apps/telegram-ui';
import { TourService, MatchService } from '@/services';
import type { Tour, TourMatch } from '@/gql';
import { MatchList } from '../Match';
import { useTourMatches } from '@/hooks';

/**
 * Props for the TourItem component
 */
interface TourItemProps {
  /** Current tour */
  tour?: Tour;
  /** Whether tour is current */
  isTourCurrent: boolean;
  /** Tour matches */
  currentMatches?: TourMatch[];
  /** */
  tourLoading: boolean;
}

/**
 * TourItem component for displaying tour information
 * Renders tour accordion with name, status, and expandable content
 */
export const TourItem: FC<TourItemProps> = ({
  tour,
  isTourCurrent,
  currentMatches,
  tourLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Reset expansion state when tour changes
  useEffect(() => {
    setIsExpanded(false);
  }, [tour?.id]);

  // Handle tour expansion
  const handleExpand = (isExpanded: boolean): void => {
    setIsExpanded(isExpanded);
  };

  const tourId = tour?.id;

  // Tour Matches
  const shouldLoadMatches = !tourLoading && !isTourCurrent && isExpanded;
  const { data: matches, loading: matchesLoading } = useTourMatches(tourId!, {
    skip: !tourId || !shouldLoadMatches,
  });

  const tourHint = TourService.formatStatus(tour) || '░░░░░░░░░░';

  let matchesStartedCount;
  if (TourService.isInProgress(tour)) {
    matchesStartedCount =
      MatchService.filterMatchesStarted(currentMatches)?.length.toString();
  }

  return (
    <Skeleton visible={tourLoading}>
      <Accordion expanded={isExpanded} onChange={handleExpand}>
        <Accordion.Summary
          hint={tourHint}
          titleBadge={
            matchesStartedCount ? (
              <Badge type="number">{matchesStartedCount}</Badge>
            ) : undefined
          }
        >
          {tour?.name}
        </Accordion.Summary>
        {isExpanded && (
          <MatchList
            matches={isTourCurrent ? currentMatches : matches}
            matchesLoading={tourLoading || matchesLoading}
            Component={Accordion.Content}
          />
        )}
      </Accordion>
    </Skeleton>
  );
};
