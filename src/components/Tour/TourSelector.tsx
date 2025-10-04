import { useEffect, useMemo, useState, type FC } from 'react';
import { TourService } from '@/services';
import { Pagination } from '@telegram-apps/telegram-ui';
import { useContextTournament } from '@/hooks';

/**
 * Props for TourSelector component.
 */
interface TourSelectorProps {
  /** Currently selected tour ID */
  tourId?: string;
  /** Callback function called when tour selection changes */
  onChange?: (tourId: string) => void;
}

/**
 * Component for selecting tours using pagination controls.
 * Displays available tours from the current tournament season as numbered pages.
 * Allows navigation between tours and notifies parent component of changes.
 *
 * @param props - The component props
 * @returns Pagination component for tour selection
 */
export const TourSelector: FC<TourSelectorProps> = ({ tourId, onChange }) => {
  const tournament = useContextTournament();
  const tours = useMemo(
    () => TourService.filterAvailableTours(tournament?.currentSeason?.tours),
    [tournament]
  );

  const [tourNumber, setTourNumber] = useState<number | undefined>(
    TourService.getTourNumberById(tourId, tours)
  );

  useEffect(() => {
    setTourNumber(TourService.getTourNumberById(tourId, tours));
  }, [tourId, tours, setTourNumber]);

  // Handle tour number selection and notify parent
  const handleTourChange = (_event: unknown, page: number): void => {
    const newTourId = TourService.getTourIdByNumber(page, tours);
    if (!newTourId || !onChange) {
      return;
    }
    onChange(newTourId);
  };

  return (
    // TODO: switch to tabs (horizontal scroll) or fit to all devices
    <Pagination
      hideNextButton
      hidePrevButton
      boundaryCount={1}
      count={tours?.length || 0}
      siblingCount={1}
      page={tourNumber}
      onChange={handleTourChange}
    />
  );
};
