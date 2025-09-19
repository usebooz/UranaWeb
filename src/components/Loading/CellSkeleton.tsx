import { type FC } from 'react';
import { Cell, Skeleton } from '@telegram-apps/telegram-ui';

/**
 *
 */
interface CellSkeletonProps {
  withSubtitle?: boolean;
}

const skeletonText = '░░░░░░░░░░';

/**
 *
 *
 */
export const CellSkeleton: FC<CellSkeletonProps> = ({
  withSubtitle = false,
}) => (
  <Skeleton visible>
    <Cell subtitle={withSubtitle && skeletonText}>{skeletonText}</Cell>
  </Skeleton>
);
