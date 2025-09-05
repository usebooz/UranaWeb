import { Image, Caption, BadgeProps } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { type SquadTourPlayer, type TourMatch } from '@/gql';
import { MatchService, PlayerService } from '@/services';

import './Player.css';

interface PlayerProps {
  player: SquadTourPlayer;
  matches?: TourMatch[];
  matchesFinished?: boolean;
  tourAfterCurrent?: boolean;
  className?: string;
}

/**
 * Player component for displaying individual player information
 *
 */
export const Player: FC<PlayerProps> = ({
  player,
  matches,
  matchesFinished = false,
  tourAfterCurrent = false,
  className = '',
}) => {
  const playerId = player.seasonPlayer.statObject.id;
  const match = MatchService.findMatchByTeamId(
    matches,
    player.seasonPlayer.team?.statObject.id
  );

  let badgeMode: BadgeProps['mode'], badgeClassName, badgeContent, showBadge;
  const setBadgeScore = () => {
    if (MatchService.isInProgress(match)) {
      badgeMode = PlayerService.isPointsMayCount(player)
        ? 'secondary'
        : 'primary';
      badgeContent =
        player.score?.toString() ||
        (MatchService.isPlayerInLineup(match, playerId) && '0');
    } else {
      badgeMode = 'gray';
      badgeContent = player.score?.toString();
    }
    if (badgeContent) {
      badgeClassName = PlayerService.isPointsNotCount(player)
        ? 'text-crossed'
        : '';
    } else {
      badgeContent = '-';
    }
    showBadge = true;
  };
  const setBadgeStatus = () => {
    if (match?.hasLineups) {
      badgeContent = MatchService.getLineupPlayerStatus(match, playerId, true);
    } else {
      badgeContent = PlayerService.getStatusEmoji(player);
    }
    if (!badgeContent) {
      return;
    }
    badgeClassName = 'transparent-bg-color';
    showBadge = true;
  };

  if (tourAfterCurrent) {
    showBadge = false;
  } else if (matchesFinished || MatchService.isScoreAvailable(match)) {
    setBadgeScore();
  } else {
    setBadgeStatus();
  }

  let subCaption;
  if (player.isStarting) {
    subCaption = PlayerService.getCaptainEmoji(player);
  } else {
    const roleEmoji = PlayerService.getRoleEmoji(player);
    subCaption = PlayerService.isGoalkeeper(player)
      ? roleEmoji
      : `${player.substitutePriority}. ${roleEmoji}`;
  }

  return (
    <div className={`player ${className}`}>
      <Image
        className="player-image"
        size={28}
        src={player.seasonPlayer.team?.svgKit?.url || undefined}
        fallbackIcon={<span>👤</span>}
      >
        {showBadge && (
          <Image.Badge
            type="number"
            mode={badgeMode}
            className={`player-badge ${badgeClassName}`}
          >
            {badgeContent}
          </Image.Badge>
        )}
      </Image>
      <Caption level="2" className="player-name">
        {player.seasonPlayer.statObject.lastName}
      </Caption>
      {subCaption && <Caption level="2">{subCaption}</Caption>}
    </div>
  );
};
