import { type FC } from 'react';
import { Cell, Info } from '@telegram-apps/telegram-ui';
import { SquadService, TourService } from '@/services';
import { useContextSquads, useContextTour } from '@/hooks';

/**
 * Component that displays the header section for squads list.
 * Shows tour winner information, total squads count, and table headers.
 * Displays different headers based on tour state (finished vs in progress).
 *
 * @returns Header section with winner info and column headers for squads table
 */
export const SquadsHeader: FC = () => {
  const tour = useContextTour();
  const squads = useContextSquads();

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
      {squadsHeader ? (
        <Cell className="squad-table-headers" readOnly>
          {squadsHeader}
        </Cell>
      ) : undefined}
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
