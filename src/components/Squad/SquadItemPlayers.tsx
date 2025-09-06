import { type FC } from 'react';
import { Cell, Info, Placeholder } from '@telegram-apps/telegram-ui';

import { Player } from '@/components/Player/Player';
import { MatchService, PlayerService, TourService } from '@/services';
import { FantasyPlayerRole } from '@/gql/generated/graphql';
import {
  Tour,
  type SquadTourInfo,
  type SquadTourPlayer,
  type TourMatch,
} from '@/gql';

/**
 * Props for the SquadTourInfo component
 */
interface SquadItemPlayersProps {
  /** Squad tour info with players data */
  squadTourInfo?: SquadTourInfo;
  /** Array of matches for the tour */
  matches?: TourMatch[];
  /**  */
  tour?: Tour;
  /**  */
  isTourCurrent: boolean;
}

/**
 * SquadTourInfo component for displaying squad players information
 * Renders players by positions and substitutes
 */
export const SquadItemPlayers: FC<SquadItemPlayersProps> = ({
  squadTourInfo,
  matches,
  tour,
  isTourCurrent,
}) => {
  const matchesFinished = TourService.isFinished(tour);
  const tourAfterCurrent = !matchesFinished && !isTourCurrent;

  const players = squadTourInfo?.tourInfo?.players;
  if (!players || players.length === 0) {
    return <Placeholder header="Игроки не найдены" />;
  }

  const playersStarted = [
    FantasyPlayerRole.Goalkeeper,
    FantasyPlayerRole.Defender,
    FantasyPlayerRole.Midfielder,
    FantasyPlayerRole.Forward,
  ].map((role, i) => {
    const roleKey = squadTourInfo.id + i;
    const rolePlayers = PlayerService.filterStartPlayersByRole(players, role);
    const fakePlayer = { seasonPlayer: { role: role } } as SquadTourPlayer;

    return (
      <Cell
        key={roleKey}
        className="cell-display-block cell-align-items-center cell-overflow-visible"
        readOnly
        before={
          <Info type="text" subtitle={PlayerService.getRoleEmoji(fakePlayer)} />
        }
      >
        {rolePlayers.map((player, j) => (
          <Player
            key={roleKey + j}
            player={player}
            matches={matches}
            matchesFinished={matchesFinished}
            tourAfterCurrent={tourAfterCurrent}
          />
        ))}
      </Cell>
    );
  });

  const subKey = squadTourInfo.id + 5;
  const subPlayers = PlayerService.filterPlayersOnBench(players);
  const substitutes = (
    <Cell
      key={subKey}
      className="cell-display-block cell-overflow-visible"
      readOnly
      before={<Info type="text" subtitle={MatchService.subEmoji} />}
      hovered
    >
      {subPlayers.map((player, j) => (
        <Player
          key={subKey + j}
          player={player}
          matches={matches}
          matchesFinished={matchesFinished}
          tourAfterCurrent={tourAfterCurrent}
        />
      ))}
    </Cell>
  );

  return [...playersStarted, substitutes];
};
