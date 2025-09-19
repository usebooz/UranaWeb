import { Image } from '@telegram-apps/telegram-ui';
import { useMemo, type FC } from 'react';
import { type SquadTourPlayer } from '@/gql';
import { MatchService, PlayerService } from '@/services';
import { useReadTourMatches } from '@/hooks';
import { QueryRef } from '@apollo/client';
import {
  GetTourMatchesQuery,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import { PlayerScore } from './PlayerScore';

interface PlayerMatchStatusProps {
  player: SquadTourPlayer;
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>;
}

/**
 *
 */
export const PlayerMatchStatus: FC<PlayerMatchStatusProps> = ({
  player,
  queryRef,
}) => {
  const matches = useReadTourMatches(queryRef);
  const playerId = player.seasonPlayer.statObject.id;
  const match = useMemo(
    () => MatchService.findMatchByTeamId(matches, playerId),
    [matches, playerId]
  );
  const isInProgress = useMemo(() => MatchService.isInProgress(match), [match]);
  const isPlayerInLineup = useMemo(
    () => MatchService.isPlayerInLineup(match, playerId),
    [match, playerId]
  );
  const lineupStatus = useMemo(
    () => MatchService.getLineupPlayerStatus(match, playerId, true),
    [match, playerId]
  );
  const statusEmoji = useMemo(
    () => PlayerService.getStatusEmoji(player),
    [player]
  );
  if (MatchService.isScoreAvailable(match)) {
    return (
      <PlayerScore
        player={player}
        inProgress={isInProgress}
        inLineup={isPlayerInLineup}
      />
    );
  }

  const badgeContent = match?.hasLineups ? lineupStatus : statusEmoji;
  if (!badgeContent) {
    return undefined;
  }

  return (
    <Image.Badge type="number" className={`player-badge transparent-bg-color`}>
      {badgeContent}
    </Image.Badge>
  );
};
