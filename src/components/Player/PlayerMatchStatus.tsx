import { Image } from '@telegram-apps/telegram-ui';
import { useMemo, type FC } from 'react';
import { type SquadTourPlayer } from '@/gql';
import { MatchService, PlayerService } from '@/services';
import { useReadTourMatches } from '@/hooks';
import { QueryRef } from '@apollo/client/react';
import {
  GetTourMatchesQuery,
  GetTourMatchesQueryVariables,
} from '@/gql/generated/graphql';
import { PlayerScore } from './PlayerScore';

/**
 * Props for PlayerMatchStatus component.
 */
interface PlayerMatchStatusProps {
  /** The squad tour player data */
  player: SquadTourPlayer;
  /** Apollo Client query reference for tour matches */
  queryRef: QueryRef<GetTourMatchesQuery, GetTourMatchesQueryVariables>;
}

/**
 * Component that displays a player's match status during live matches.
 * Shows different indicators based on match state: lineup status, live score, or status emoji.
 * Used for real-time match tracking and player performance display.
 *
 * @param props - The component props
 * @returns Badge showing player's current match status
 */
export const PlayerMatchStatus: FC<PlayerMatchStatusProps> = ({
  player,
  queryRef,
}) => {
  const matches = useReadTourMatches(queryRef);
  const playerId = player.seasonPlayer.statObject.id;
  const teamId = player.seasonPlayer.team?.statObject.id;

  const match = useMemo(
    () => MatchService.findMatchByTeamId(matches, teamId),
    [matches, teamId]
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
