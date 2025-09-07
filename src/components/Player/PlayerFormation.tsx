import { ElementType, type FC } from 'react';
import { Cell, Info, Placeholder, Spinner } from '@telegram-apps/telegram-ui';

import { Player } from '@/components/Player';
import { MatchService, PlayerService, TourService } from '@/services';
import { FantasyPlayerRole } from '@/gql/generated/graphql';
import { Tour, type SquadTourPlayer, type TourMatch } from '@/gql';

/**
 * Props for the
 */
interface PlayerFormationProps {
  /** Squad tour info with players data */
  players?: SquadTourPlayer[];
  /** Array of matches for the tour */
  currentMatches?: TourMatch[];
  /**  */
  tour?: Tour;
  /**  */
  isTourCurrent: boolean;
  /** Loading states */
  playersLoading: boolean;
  /** */
  Component?: ElementType;
}

/**
 * component for displaying squad players information
 * Renders players by positions and substitutes
 */
export const PlayerFormation: FC<PlayerFormationProps> = ({
  players,
  currentMatches,
  tour,
  isTourCurrent,
  playersLoading,
  Component,
}) => {
  if (playersLoading) {
    return (
      <Placeholder>
        <Spinner size="m" />
      </Placeholder>
    );
  }

  if (!players || players.length === 0) {
    return <Placeholder header="Игроки не найдены" />;
  }

  const matchesFinished = TourService.isFinished(tour);
  const tourAfterCurrent = !matchesFinished && !isTourCurrent;

  const playersStarted = [
    FantasyPlayerRole.Goalkeeper,
    FantasyPlayerRole.Defender,
    FantasyPlayerRole.Midfielder,
    FantasyPlayerRole.Forward,
  ].map(role => {
    const rolePlayers = PlayerService.filterStartPlayersByRole(players, role);
    const fakePlayer = { seasonPlayer: { role: role } } as SquadTourPlayer;

    return (
      <Cell
        key={role}
        className="cell-display-block cell-align-items-center cell-overflow-visible"
        readOnly
        before={
          <Info type="text" subtitle={PlayerService.getRoleEmoji(fakePlayer)} />
        }
      >
        {rolePlayers.map(player => (
          <Player
            key={player.seasonPlayer.id}
            player={player}
            currentMatches={currentMatches}
            matchesFinished={matchesFinished}
            tourAfterCurrent={tourAfterCurrent}
          />
        ))}
      </Cell>
    );
  });

  const subPlayers = PlayerService.filterPlayersOnBench(players);
  const substitutes = (
    <Cell
      key={'SUBSTITUTE'}
      className="cell-display-block cell-overflow-visible"
      readOnly
      before={<Info type="text" subtitle={MatchService.subEmoji} />}
      hovered
    >
      {subPlayers.map(player => (
        <Player
          key={player.seasonPlayer.id}
          player={player}
          currentMatches={currentMatches}
          matchesFinished={matchesFinished}
          tourAfterCurrent={tourAfterCurrent}
        />
      ))}
    </Cell>
  );

  const Container = Component || (({ children }) => <>{children}</>);
  return (
    <Container className="secondary-bg-color">
      {[...playersStarted, substitutes]}
    </Container>
  );
};
