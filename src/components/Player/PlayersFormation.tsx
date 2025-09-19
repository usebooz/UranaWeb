import { type FC } from 'react';
import { Cell, Info, Placeholder } from '@telegram-apps/telegram-ui';

import { Player } from '@/components/Player';
import { MatchService, PlayerService } from '@/services';
import {
  FantasyPlayerRole,
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
} from '@/gql/generated/graphql';
import { QueryRef } from '@apollo/client';
import { useReadSquadTourInfo } from '@/hooks';
import { SquadTourPlayer } from '@/gql';

/**
 *
 */
interface PlayersFormationProps {
  queryRef: QueryRef<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>;
}

/**
 *
 *
 */
export const PlayersFormation: FC<PlayersFormationProps> = ({ queryRef }) => {
  const players = useReadSquadTourInfo(queryRef)?.players;
  if (!players || players.length === 0) {
    return <Placeholder header="Игроки не найдены" />;
  }

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
          <Player key={player.seasonPlayer.id} player={player} />
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
        <Player key={player.seasonPlayer.id} player={player} />
      ))}
    </Cell>
  );

  return <>{[...playersStarted, substitutes]}</>;
};
