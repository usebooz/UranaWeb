import { useMemo, type FC } from 'react';
import { QueryRef } from '@apollo/client';
import {
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
} from '@/gql/generated/graphql';
import { useReadSquadTourInfo } from '@/hooks';
import { SquadService } from '@/services';

interface SquadTourInfoProps {
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
export const SquadTourInfo: FC<SquadTourInfoProps> = ({ queryRef }) => {
  const tourInfo = useReadSquadTourInfo(queryRef);
  const transfers = useMemo(() => {
    const transfersDone = tourInfo?.transfersDone.toString();
    const transfersTotal = SquadService.formatSquadTransfersTotal(tourInfo);
    return (
      transfersDone && transfersTotal && `🔄 ${transfersDone}/${transfersTotal}`
    );
  }, [tourInfo]);
  return transfers;
};
