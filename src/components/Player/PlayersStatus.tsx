import { useMemo, type FC } from 'react';
import { QueryRef } from '@apollo/client/react';
import {
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
} from '@/gql/generated/graphql';
import { useReadSquadTourInfo } from '@/hooks';
import { Badge } from '@telegram-apps/telegram-ui';
import { PlayerService } from '@/services';

/**
 * Props for PlayersStatus component.
 */
interface PlayersStatusProps {
  /** Apollo Client query reference for squad tour info */
  queryRef: QueryRef<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>;
}

/**
 * Component that displays a badge showing the count of players whose points are counting.
 * Shows the number of players whose fantasy points will be included in the final score.
 *
 * @param props - The component props
 * @returns Badge with count of players whose points count, or null if no players
 */
export const PlayersStatus: FC<PlayersStatusProps> = ({ queryRef }) => {
  const players = useReadSquadTourInfo(queryRef)?.players;
  const playersPointsCount = useMemo(
    () =>
      PlayerService.filterPlayersWithPointsCount(
        players || []
      )?.length.toString(),
    [players]
  );

  return (
    playersPointsCount && <Badge type="number">{playersPointsCount}</Badge>
  );
};
