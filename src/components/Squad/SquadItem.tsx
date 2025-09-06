import { type FC } from 'react';
import {
  Accordion,
  Badge,
  Info,
  Spinner,
  Placeholder,
} from '@telegram-apps/telegram-ui';

import { SquadItemPlayers } from './SquadItemPlayers';
import { PlayerService, SquadService, TourService } from '@/services';
import { useLeagueSquadTourInfo } from '@/hooks/useSquad';
import {
  Tour,
  type LeagueSquad,
  type SquadTourInfo,
  type TourMatch,
} from '@/gql';

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
  matches?: TourMatch[];
  /** Whether tour is current */
  isTourCurrent: boolean;
  /** Whether the squad item is expanded */
  isExpanded: boolean;
  /** Callback when squad expand state changes */
  onExpandChange: (isExpanded: boolean) => void;
}

/**
 * SquadItem component for displaying individual squad information
 * Renders squad summary in accordion with expandable tour info
 */
export const SquadItem: FC<SquadItemProps> = ({
  squad,
  squadCurrentTourInfo,
  tour,
  matches,
  isTourCurrent,
  isExpanded,
  onExpandChange,
}) => {
  // Dynamic loading for non-current tours when expanded
  const shouldLoadSquadTourInfo = !isTourCurrent && isExpanded;
  const { data: squadTourInfo, loading: infoLoading } = useLeagueSquadTourInfo(
    tour!.id,
    squad.squad.id,
    { skip: !tour?.id || !shouldLoadSquadTourInfo }
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
    <Accordion expanded={isExpanded} onChange={onExpandChange}>
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
            className={`table-column-before ${seasonPlaceDiffClass}`}
            style={{
              '--table-column-before--number': columnPlaceWidth,
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
      {isExpanded && infoLoading && (
        <Accordion.Content className="secondary-bg-color">
          <Placeholder>
            <Spinner size="m" />
          </Placeholder>
        </Accordion.Content>
      )}
      {isExpanded && !infoLoading && (
        <Accordion.Content className="secondary-bg-color">
          <SquadItemPlayers
            squadTourInfo={isTourCurrent ? squadCurrentTourInfo : squadTourInfo}
            matches={matches}
            tour={tour}
            isTourCurrent={isTourCurrent}
          />
        </Accordion.Content>
      )}
    </Accordion>
  );
};
