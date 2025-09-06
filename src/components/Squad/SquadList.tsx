import { type FC, useState } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { SquadItem } from './SquadItem';
import { TourService } from '@/services';
import {
  type LeagueSquad,
  type SquadTourInfo,
  type TourMatch,
  type Tour,
} from '@/gql';

/**
 * Props for the SquadList component
 */
interface SquadListProps {
  /** Array of squads with rating information */
  squads?: LeagueSquad[];
  /** Array of squad tour info with players data */
  squadsCurrentTourInfo?: SquadTourInfo[];
  /** Current tour data */
  tour?: Tour;
  /** Array of matches for the tour */
  matches?: TourMatch[];
  /** Whether tour is current */
  isTourCurrent: boolean;
}

/**
 * SquadList component for displaying list of squads
 * Renders all squads or shows placeholder if no squads found
 */
export const SquadList: FC<SquadListProps> = ({
  squads,
  squadsCurrentTourInfo,
  tour,
  matches,
  isTourCurrent,
}) => {
  const [expandedSquads, setExpandedSquads] = useState<Set<string>>(new Set());

  const handleSquadExpand = (squadId: string, isExpanded: boolean) => {
    setExpandedSquads(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(squadId);
      } else {
        newSet.delete(squadId);
      }
      return newSet;
    });
  };
  if (!squads || squads.length === 0) {
    return <Placeholder header="Команды не найдены" />;
  }

  if (TourService.isInProgress(tour)) {
    // SquadService.recalculateSquadsLiveScore could be implemented here
  }

  return (
    <>
      {squads.map(squad => {
        const squadCurrentTourInfo = squadsCurrentTourInfo?.find(
          s => s.id === squad.squad.id
        );

        return (
          <SquadItem
            key={squad.squad.id}
            squad={squad}
            squadCurrentTourInfo={squadCurrentTourInfo}
            tour={tour}
            matches={matches}
            isTourCurrent={isTourCurrent}
            isExpanded={expandedSquads.has(squad.squad.id)}
            onExpandChange={(isExpanded: boolean) =>
              handleSquadExpand(squad.squad.id, isExpanded)
            }
          />
        );
      })}
    </>
  );
};
