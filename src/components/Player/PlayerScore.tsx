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

  let badgeMode: BadgeProps['mode'], badgeClassName, badgeContent;
  if (inProgress) {
    badgeMode = isPointsMayCount ? 'secondary' : 'primary';
    badgeContent = player.score?.toString() || (inLineup && '0');
  } else {
    badgeMode = 'gray';
    badgeContent = player.score?.toString();
  }
  if (badgeContent) {
    badgeClassName = isPointsNotCount ? 'text-crossed' : '';
  } else {
    badgeContent = '-';
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
