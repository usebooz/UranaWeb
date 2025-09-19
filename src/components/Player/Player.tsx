import { Image, Caption } from '@telegram-apps/telegram-ui';
import { Suspense, useMemo, type FC } from 'react';
import { type SquadTourPlayer } from '@/gql';
import { PlayerService, TourService } from '@/services';
import {
  useContextCurrentTourMatches,
  useContextTour,
  useIsTourCurrent,
} from '@/hooks';
import { PlayerScore } from './PlayerScore';
import { PlayerMatchStatus } from './PlayerMatchStatus';
import { BadgeLoading } from '../Loading/BadgeLoading';

interface PlayerProps {
  player: SquadTourPlayer;
}

/**
 *
 */
export const Player: FC<PlayerProps> = ({ player }) => {
  const [matchesQueryRef] = useContextCurrentTourMatches();
  const tour = useContextTour();
  const isTourCurrent = useIsTourCurrent();
  const matchesFinished = useMemo(() => TourService.isFinished(tour), [tour]);

  let badge;
  if (matchesFinished) {
    badge = <PlayerScore player={player} />;
  } else if (isTourCurrent && matchesQueryRef) {
    badge = <PlayerMatchStatus player={player} queryRef={matchesQueryRef} />;
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
    <div className="player">
      <Image
        className="player-image"
        size={28}
        src={player.seasonPlayer.team?.svgKit?.url || undefined}
        fallbackIcon={<span>👤</span>}
      >
        <Suspense fallback={<BadgeLoading transparent />}>{badge}</Suspense>
      </Image>
      <Caption level="2" className="player-name">
        {player.seasonPlayer.statObject.lastName}
      </Caption>
      {subCaption && <Caption level="2">{subCaption}</Caption>}
    </div>
  );
};
