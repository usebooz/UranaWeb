import { type FC } from 'react';
import { Cell, Skeleton } from '@telegram-apps/telegram-ui';

/**
 * Props for CellSkeleton component.
 */
interface CellSkeletonProps {
  /** Whether to show subtitle skeleton */
  withSubtitle?: boolean;
}

/** Placeholder text pattern for skeleton loading */
const skeletonText = '░░░░░░░░░░';

/**
 * Skeleton loading component that mimics a Cell structure.
 * Displays animated placeholder content while actual data is loading.
 * Used to maintain layout stability during loading states.
 *
 * @param props - The component props
 * @returns Skeleton Cell with placeholder content
 */
export const CellSkeleton: FC<CellSkeletonProps> = ({
  withSubtitle = false,
}) => (
  <Skeleton visible>
    <Cell subtitle={withSubtitle && skeletonText}>{skeletonText}</Cell>
  </Skeleton>
);
