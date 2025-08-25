import type { League } from '@/gql';
import { TourService } from './tour.service';

/**
 * Service for league and season management operations
 */
export class LeagueService {
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;

  /**
   * Gets current tour ID from league (in progress or active tour)
   * @param league - league data
   * @returns current tour ID or undefined
   */
  static getCurrentTourId(league: League): string | undefined {
    const tourInProgress = TourService.findTouInProgress(league?.season.tours);
    return tourInProgress?.id || league?.season?.currentTour?.id;
  }

  /**
   * Checks if league belongs to active RPL season
   * @param league - league data
   * @returns true if league is from active RPL season
   */
  static isFromActiveRplSeason(league: League): boolean {
    return !!(
      league?.season.isActive &&
      league.season.tournament.webName === this.rplWebname
    );
  }
}
