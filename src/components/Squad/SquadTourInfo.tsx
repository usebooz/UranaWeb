import { useMemo, type FC } from 'react';
import { QueryRef } from '@apollo/client';
import {
  GetSquadTourInfoQuery,
  GetSquadTourInfoQueryVariables,
} from '@/gql/generated/graphql';
import { useReadSquadTourInfo } from '@/hooks';
import { SquadService } from '@/services';

/**
 * Props for SquadTourInfo component.
 */
interface SquadTourInfoProps {
  /** Apollo Client query reference for squad tour info */
  queryRef: QueryRef<GetSquadTourInfoQuery, GetSquadTourInfoQueryVariables>;
}

/**
 * Component that displays squad transfer information for the current tour.
 * Shows the number of transfers made vs total transfers available.
 * Used to track squad management activity during tours.
 *
 * @param props - The component props
 * @returns Transfer information string or null if no transfers data
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
