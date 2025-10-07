import { Suspense, useEffect, useMemo, useState, type FC } from 'react';
import { Accordion, Info } from '@telegram-apps/telegram-ui';

import { SquadService, TourService } from '@/services';
import { PlayersStatus, PlayersFormation } from '../Player';
import {
  useContextTour,
  useIsTourCurrent,
  useLoadableSquadTourInfo,
} from '@/hooks';
import { LeagueSquad } from '@/gql';
import { PlaceSpinner } from '../Loading';
import { SquadTourInfo } from './SquadTourInfo';
import { BadgeLoading } from '../Loading/BadgeLoading';
import { SquadTop } from './SquadTop';

/**
 * Props for SquadItem component.
 */
interface SquadItemProps {
  /** The league squad data to display */
  squad: LeagueSquad;
}

/**
 * Component that displays a single squad item in the league.
 * Shows squad position, name, score, and expandable tour details.
 * Lazy loads tour info when accordion is expanded for current tours.
 *
 * @param props - The component props
 * @returns Accordion item with squad information and expandable details
 */
export const SquadItem: FC<SquadItemProps> = ({ squad }) => {
  const [loadTourInfo, tourInfoQueryRef] = useLoadableSquadTourInfo();

  const tour = useContextTour();
  const isTourInProgress = useMemo(
    () => TourService.isInProgress(tour),
    [tour]
  );
  const isScoreAvailable = useMemo(
    () => TourService.isScoreAvailable(tour),
    [tour]
  );
  const isOpened = useMemo(() => TourService.isOpened(tour), [tour]);

  //Load tourInfo if current tour
  const isTourCurrent = useIsTourCurrent();
  useEffect(() => {
    if (isTourCurrent) {
      loadTourInfo({ tourId: tour.id, squadId: squad.squad.id });
    }
  }, [tour, isTourCurrent]);

  //Load tourInfo during expanding
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const handleExpand = (isExpanded: boolean): void => {
    setIsExpanded(isExpanded);
    if (isExpanded) {
      loadTourInfo({ tourId: tour.id, squadId: squad.squad.id });
    }
  };

  //TODO refactor
  let seasonPlace,
    tourScore,
    seasonScore,
    seasonPlaceDiff,
    seasonPlaceDiffClass;
  if (isScoreAvailable) {
    seasonPlace = squad.scoreInfo.placeAfterTour.toString();
    tourScore = squad.scoreInfo.score.toString();
    seasonScore = squad.scoreInfo.pointsAfterTour.toString();
    seasonPlaceDiff = SquadService.formatPlaceDiff(squad);
    seasonPlaceDiffClass = SquadService.isPlaceDiffNegative(squad)
      ? 'info-subtitle-destructive-text-color'
      : 'info-subtitle-accent-text-color';
  } else {
    seasonPlace = squad.scoreInfo.place.toString();
    tourScore = SquadService.formatAverageScore(squad);
    seasonScore = squad.scoreInfo.score.toString();
  }
  const columnPlaceWidth = squad.scoreInfo.totalPlaces.toString().length;

  return (
    <Accordion expanded={isExpanded} onChange={handleExpand}>
      <Accordion.Summary
        titleBadge={
          <Suspense fallback={<BadgeLoading />}>
            {isTourInProgress && tourInfoQueryRef ? (
              <PlayersStatus queryRef={tourInfoQueryRef} />
            ) : (
              isOpened && <SquadTop squad={squad} />
            )}
          </Suspense>
        }
        subhead={squad.squad.user.nick}
        subtitle={
          <Suspense fallback="⏳">
            {isTourCurrent && tourInfoQueryRef ? (
              <SquadTourInfo queryRef={tourInfoQueryRef} />
            ) : undefined}
          </Suspense>
        }
        before={
          <Info
            type="text"
            className={`squad-table-column-before ${seasonPlaceDiffClass}`}
            style={{
              '--squad-table-column-before--number': columnPlaceWidth,
            }}
            subtitle={seasonPlaceDiff}
          >
            {seasonPlace}
          </Info>
        }
        after={
          <Info type="text" subtitle={tourScore}>
            {seasonScore}
          </Info>
        }
      >
        {squad.squad.name}
      </Accordion.Summary>
      <Suspense
        fallback={
          <Accordion.Content>
            <PlaceSpinner size="m" />
          </Accordion.Content>
        }
      >
        {isExpanded && tourInfoQueryRef && (
          <Accordion.Content>
            <PlayersFormation queryRef={tourInfoQueryRef} />
          </Accordion.Content>
        )}
      </Suspense>
    </Accordion>
  );
};
