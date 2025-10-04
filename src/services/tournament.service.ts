import type { Tournament } from '@/gql';
import { TourService } from './tour.service';

/**
 * Service class for tournament-related operations and data management.
 * Handles tournament configuration and current tour identification.
 */
export class TournamentService {
  /** The webname identifier for the RPL tournament from environment variables */
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;

  /**
   * Gets the current tour ID from a tournament.
   * Prioritizes tours in progress over the current tour set in the season.
   *
   * @param tournament - The tournament data
   * @returns The current tour ID or undefined if none found
   */
  static getCurrentTourId(tournament: Tournament): string | undefined {
    const tourInProgress = TourService.findTourInProgress(
      tournament.currentSeason?.tours
    );
    return tourInProgress?.id || tournament.currentSeason?.currentTour?.id;
  }
}
