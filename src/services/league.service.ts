import type { League } from '@/gql';

/**
 * Service for league and season management operations.
 * Handles league validation and season compatibility checks.
 */
export class LeagueService {
  /** The webname identifier for the RPL tournament from environment variables */
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;

  /**
   * Checks if a league belongs to the specified season.
   *
   * @param league - The league data to check
   * @param seasonId - The season ID to validate against
   * @returns True if the league belongs to the current season
   */
  static isFromCurrentSeason(league: League, seasonId?: string): boolean {
    return league.season.id === seasonId;
  }
}
