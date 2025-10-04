import { Suspense, useEffect, useMemo, useState, type FC } from 'react';
import { Accordion } from '@telegram-apps/telegram-ui';
import { TourService } from '@/services';
import {
  useContextTour,
  useIsTourCurrent,
  useLoadableTourMatches,
} from '@/hooks';
import { MatchesStatus, MatchesList } from '../Match';
import { PlaceSpinner } from '../Loading';
import { BadgeLoading } from '../Loading/BadgeLoading';

/**
 * Component that displays tour information in an expandable accordion.
 * Shows tour name, status, and matches count. Lazy loads matches data when expanded.
 * Automatically loads matches for current tours to show live updates.
 *
 * @returns Accordion component with tour information and expandable matches list
 */
export const TourItem: FC = () => {
  const tour = useContextTour();
  const [loadMatches, matchesQueryRef] = useLoadableTourMatches();

  // Load matches if current tour (for live updates)
  const isTourCurrent = useIsTourCurrent();
  useEffect(() => {
    if (isTourCurrent) {
      loadMatches({ id: tour.id });
    }
  }, [tour, isTourCurrent]);

  // Load matches during expanding
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const handleExpand = (isExpanded: boolean): void => {
    setIsExpanded(isExpanded);
    if (isExpanded) {
      loadMatches({ id: tour.id });
    }
  };

  const tourStatus = useMemo(() => TourService.formatStatus(tour), [tour]);
  const isTourInProgress = useMemo(
    () => TourService.isInProgress(tour),
    [tour]
  );

  return (
    <Accordion expanded={isExpanded} onChange={handleExpand}>
      <Accordion.Summary
        hint={tourStatus}
        titleBadge={
          <Suspense fallback={<BadgeLoading />}>
            {isTourInProgress && matchesQueryRef ? (
              <MatchesStatus queryRef={matchesQueryRef} />
            ) : undefined}
          </Suspense>
        }
      >
        {tour?.name}
      </Accordion.Summary>
      <Suspense fallback={<PlaceSpinner size="m" />}>
        {isExpanded && matchesQueryRef && (
          <Accordion.Content>
            <MatchesList queryRef={matchesQueryRef} />
          </Accordion.Content>
        )}
      </Suspense>
    </Accordion>
  );
};
