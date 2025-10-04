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

/**
 * Props for Player component.
 */
interface PlayerProps {
  /** The squad tour player data to display */
  player: SquadTourPlayer;
}

/**
 * Component that displays a player with their team kit, score/status badge, and basic information.
 * Shows different badges based on tour status: PlayerScore for finished tours, PlayerMatchStatus for current tours.
 * Displays appropriate subcaption based on whether player is starting or substitute.
 *
 * @param props - The component props
 * @returns A player card with image, name, and status information
 */
export const Player: FC<PlayerProps> = ({ player }) => {
  const [matchesQueryRef] = useContextCurrentTourMatches();
  const tour = useContextTour();
  const isTourCurrent = useIsTourCurrent();
  const matchesFinished = useMemo(() => TourService.isFinished(tour), [tour]);

  // Determine which badge to show based on tour status
  let badge;
  if (matchesFinished) {
    badge = <PlayerScore player={player} />;
  } else if (isTourCurrent && matchesQueryRef) {
    badge = <PlayerMatchStatus player={player} queryRef={matchesQueryRef} />;
  }

  // Build subcaption based on player status (starting vs substitute)
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
