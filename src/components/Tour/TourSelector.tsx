import { type FC } from 'react';
import { TourPagination } from './TourPagination';
import { TourItem } from './TourItem';
import { TourService } from '@/services';
import type { Tour, TourMatch } from '@/gql';

/**
 * Props for the component
 */
interface TourSelectorProps {
  /**  */
  tours?: Tour[];
  /** Current tour data */
  tour?: Tour;
  /** Loading states */
  tourLoading: boolean;
  /** Whether tour is current */
  isTourCurrent: boolean;
  /** Tour matches */
  currentMatches?: TourMatch[];
  /** Callback when tour page changes */
  onTourChange: (tourId: string) => void;
}

/**
 * component for displaying tour navigation and details
 * Renders tour pagination, tour item with matches
 */
export const TourSelector: FC<TourSelectorProps> = ({
  tours,
  tour,
  tourLoading,
  isTourCurrent,
  currentMatches,
  onTourChange,
}) => {
  // Handle tour page change
  const handleTourChange = (_event: unknown, page: number): void => {
    const selectedTour = TourService.findTourByPage(page, tours);
    if (selectedTour) {
      onTourChange(selectedTour.id);
    }
  };

  return (
    <>
      <TourPagination
        tour={tour}
        tours={tours}
        onTourChange={handleTourChange}
      />
      <TourItem
        tourLoading={tourLoading}
        tour={tour}
        isTourCurrent={isTourCurrent}
        currentMatches={currentMatches}
      />
    </>
  );
};
