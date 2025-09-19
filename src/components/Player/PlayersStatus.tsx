import { useMemo, type FC } from 'react';
import { QueryRef } from '@apollo/client';
import {
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
} from '@/gql/generated/graphql';
import { useReadSquadTourInfo } from '@/hooks';
import { Badge } from '@telegram-apps/telegram-ui';
import { PlayerService } from '@/services';

interface PlayersStatusProps {
  /**
   *
   */
  queryRef: QueryRef<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>;
}

/**
 *
 * @param props
 * @returns
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
