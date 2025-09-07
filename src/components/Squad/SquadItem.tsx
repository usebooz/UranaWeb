import { useEffect, useState, type FC } from 'react';
import { Accordion, Badge, Info } from '@telegram-apps/telegram-ui';

import { PlayerService, SquadService, TourService } from '@/services';
import {
  Tour,
  type LeagueSquad,
  type SquadTourInfo,
  type TourMatch,
} from '@/gql';
import { PlayerFormation } from '../Player';
import { useLeagueSquadTourInfo } from '@/hooks';

/**
 * Props for the SquadItem component
 */
interface SquadItemProps {
  /** Squad data with rating information */
  squad: LeagueSquad;
  /** Squad tour info with players data */
  squadCurrentTourInfo?: SquadTourInfo;
  /** Current tour data */
  tour?: Tour;
  /** Array of matches for the tour */
  currentMatches?: TourMatch[];
  /** Whether tour is current */
  isTourCurrent: boolean;
}

/**
 * SquadItem component for displaying individual squad information
 * Renders squad summary in accordion with expandable tour info
 */
export const SquadItem: FC<SquadItemProps> = ({
  squad,
  squadCurrentTourInfo,
  tour,
  currentMatches,
  isTourCurrent,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [shouldLoadInfo, setShouldLoadInfo] = useState<boolean>(false);

  // Handle tour expansion
  const handleExpand = (isExpanded: boolean): void => {
    setIsExpanded(isExpanded);
  };

  useEffect(() => {
    if (!isTourCurrent && isExpanded) {
      setShouldLoadInfo(true);
    }
  }, [isTourCurrent, isExpanded]);

  const { data: squadTourInfo, loading: infoLoading } = useLeagueSquadTourInfo(
    tour!.id,
    squad.squad.id,
    { skip: !tour?.id || !shouldLoadInfo }
  );

  let seasonPlace,
    tourScore,
    seasonScore,
    seasonPlaceDiff,
    seasonPlaceDiffClass;
  if (TourService.isScoreAvailable(tour)) {
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

  const playersPointsCount =
    TourService.isInProgress(tour) &&
    PlayerService.filterPlayersWithPointsCount(
      squadCurrentTourInfo?.tourInfo?.players || []
    )?.length.toString();

  const squadTransfersDone =
    squadCurrentTourInfo?.tourInfo?.transfersDone.toString();
  const squadTransfersTotal =
    SquadService.formatSquadTransfersTotal(squadCurrentTourInfo);
  const squadTransfers =
    squadTransfersDone &&
    squadTransfersTotal &&
    `🔄 ${squadTransfersDone}/${squadTransfersTotal}`;

  return (
    <Accordion expanded={isExpanded} onChange={handleExpand}>
      <Accordion.Summary
        titleBadge={
          playersPointsCount ? (
            <Badge type="number">{playersPointsCount}</Badge>
          ) : undefined
        }
        subhead={squad.squad.user.nick}
        subtitle={squadTransfers}
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
      {isExpanded && (
        <PlayerFormation
          players={
            isTourCurrent
              ? squadCurrentTourInfo?.tourInfo?.players
              : squadTourInfo?.tourInfo?.players
          }
          currentMatches={currentMatches}
          tour={tour}
          isTourCurrent={isTourCurrent}
          playersLoading={infoLoading}
          Component={Accordion.Content}
        />
      )}
    </Accordion>
  );
};
