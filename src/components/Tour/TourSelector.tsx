import { useEffect, useMemo, useState, type FC } from 'react';
import { TourService } from '@/services';
import { Pagination } from '@telegram-apps/telegram-ui';
import { useContextTournament } from '@/hooks';

/**
 * Props for the SquadItem component
 */
interface TourSelectorProps {
  /** */
  tourId?: string;
  /** */
  onChange?: (tourId: string) => void;
}

/**
 *
 *
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

  //Set Tour Number
  const handleTourChange = (_event: unknown, page: number): void => {
    const newTourId = TourService.getTourIdByNumber(page, tours);
    if (!newTourId || !onChange) {
      return;
    }
    onChange(newTourId);
  };

  return (
    //TODO switch to tabs (horiontal scroll) or fit to all devices
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
