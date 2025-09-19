import type { Tournament } from '@/gql';
import { TourService } from './tour.service';

/**
 *
 */
export class TournamentService {
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;

  /**
   * Gets current tour ID
   * @param tournament
   * @returns current tour ID or undefined
   */
  static getCurrentTourId(tournament: Tournament): string | undefined {
    const tourInProgress = TourService.findTourInProgress(
      tournament.currentSeason?.tours
    );
    return tourInProgress?.id || tournament.currentSeason?.currentTour?.id;
  }
}
