import { Image, BadgeProps } from '@telegram-apps/telegram-ui';
import { useMemo, type FC } from 'react';
import { type SquadTourPlayer } from '@/gql';
import { PlayerService } from '@/services';

interface PlayerScoreProps {
  player: SquadTourPlayer;
  inProgress?: boolean;
  inLineup?: boolean;
}

/**
 *
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
