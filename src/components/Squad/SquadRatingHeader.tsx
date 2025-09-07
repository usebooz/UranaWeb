import { type FC } from 'react';
import { Cell, Info } from '@telegram-apps/telegram-ui';
import { SquadService, TourService } from '@/services';
import type { LeagueSquad, Tour } from '@/gql';

/**
 * Props for the SquadTableHeader component
 */
interface SquadRatingHeaderProps {
  /** Array of squads with rating information */
  squads?: LeagueSquad[];
  /** */
  tour?: Tour;
}

/**
 * SquadTableHeader component for displaying table header with column titles
 * Renders column headers for place, squad name, and score
 */
export const SquadRatingHeader: FC<SquadRatingHeaderProps> = ({
  squads,
  tour,
}) => {
  const squadsCount = SquadService.getSquadsCount(squads);
  const columnPlaceWidth = squadsCount?.length;
  const columnPlace = '🔝';
  const columnSquad = `Команда (${squadsCount})`;

  const isTourScoreAvailable = TourService.isScoreAvailable(tour);

  let squadsHeader;
  if (isTourScoreAvailable) {
    const winnerSquad = SquadService.findTourWinner(squads);
    const winnerName =
      winnerSquad &&
      `${winnerSquad.squad.name} (${winnerSquad.scoreInfo.score})`;
    squadsHeader =
      !!winnerName && TourService.isFinished(tour)
        ? `👑 ${winnerName}`
        : `1️⃣ ${winnerName}`;
  }

  let columnScore;
  if (isTourScoreAvailable) {
    columnScore = `Всего/Тур (${SquadService.formatSquadsTourAverageScore(squads)})`;
  } else {
    columnScore = 'Всего/В среднем';
  }

  return (
    <>
      <Cell className="squad-table-headers" readOnly>
        {squadsHeader}
      </Cell>
      <Cell
        readOnly
        className="squad-table-headers"
        before={
          <Info
            type="text"
            className="squad-table-column-before"
            style={{
              '--squad-table-column-before--number': columnPlaceWidth,
            }}
            subtitle={columnPlace}
          />
        }
        subtitle={columnSquad}
        after={<Info type="text" subtitle={columnScore} />}
      />
    </>
  );
};
