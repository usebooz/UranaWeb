import { Image, BadgeProps } from '@telegram-apps/telegram-ui';
import { useMemo, type FC } from 'react';
import { type SquadTourPlayer } from '@/gql';
import { PlayerService } from '@/services';

/**
 * Props for PlayerScore component.
 */
interface PlayerScoreProps {
  /** The squad tour player data */
  player: SquadTourPlayer;
  /** Whether the match is currently in progress */
  inProgress?: boolean;
  /** Whether to show in lineup context (shows '0' for no score instead of '-') */
  inLineup?: boolean;
}

/**
 * Component that displays a player's score as a badge.
 * Handles different score states: actual points, may count points, not counting points, and in-progress matches.
 * Shows appropriate visual styling based on whether points count or not.
 *
 * @param props - The component props
 * @returns An Image.Badge component with the player's score
 */
export const PlayerScore: FC<PlayerScoreProps> = ({
  player,
  inProgress = false,
  inLineup = false,
}) => {
  const isPointsMayCount = useMemo(
    () => PlayerService.isPointsMayCount(player),
    [player]
  );
  const isPointsNotCount = useMemo(
    () => PlayerService.isPointsNotCount(player),
    [player]
  );

  const badgeContent = player.score?.toString() || (inLineup && '0') || '-';
  const badgeClassName =
    isPointsNotCount && badgeContent !== '-' ? 'text-crossed' : undefined;

  let badgeMode: BadgeProps['mode'];
  if (isPointsNotCount) {
    badgeMode = 'gray';
  } else if (isPointsMayCount) {
    badgeMode = 'secondary';
  } else {
    badgeMode = inProgress ? 'primary' : 'white';
  }

  return (
    <Image.Badge
      type="number"
      mode={badgeMode}
      className={`player-badge ${badgeClassName}`}
    >
      {badgeContent}
    </Image.Badge>
  );
};
