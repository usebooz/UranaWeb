import { type FC } from 'react';
import { Pagination } from '@telegram-apps/telegram-ui';
import { TourService } from '@/services';
import type { Tour } from '@/gql';

/**
 * Props for the TourPagination component
 */
interface TourPaginationProps {
  /** Current tour */
  tour?: Tour;
  /** All available tours */
  tours?: Tour[];
  /** Callback when tour page changes */
  onTourChange: (event: unknown, page: number) => void;
}

/**
 * TourPagination component for navigating between tours
 * Renders pagination control for switching tours
 */
export const TourPagination: FC<TourPaginationProps> = ({
  tour,
  tours,
  onTourChange,
}) => {
  const availableToursCount = tours?.length || 0;
  const currentTourNumber = TourService.extractNumber(tour);

  return (
    <Pagination
      hideNextButton
      hidePrevButton
      boundaryCount={1}
      count={availableToursCount}
      siblingCount={1}
      page={currentTourNumber}
      onChange={onTourChange}
    />
  );
};
