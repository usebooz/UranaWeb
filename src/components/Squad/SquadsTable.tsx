import { type FC } from 'react';
import { Cell, Info, Placeholder, Section } from '@telegram-apps/telegram-ui';
import { SquadService, TourService } from '@/services';
import { useContextSquads, useContextTour } from '@/hooks';
import { SquadItem } from './SquadItem';

/**
 * Component that displays squads table.
 * Shows tour winner information, total squads count, and table headers.
 * Shows each squad as an expandable SquadItem or a placeholder if no squads are found.
 * Used to render the main squads listing in league views.
 *
 * @returns Section with squads table
 */
export const SquadsTable: FC = () => {
  const tour = useContextTour();
  const squads = useContextSquads();
  if (!squads || squads.length === 0) {
    return (
      <Section>
        <Placeholder header="Команды не найдены" />
      </Section>
    );
  }

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
    <Section header={squadsHeader}>
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
      {squads.map(squad => {
        return <SquadItem key={squad.squad.id} squad={squad} />;
      })}
    </Section>
  );
};
