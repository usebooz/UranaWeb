import type { League } from '@/gql';

/**
 * Service for league and season management operations
 */
export class LeagueService {
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;

  /**
   *
   * @param league - league data
   * @returns
   */
  static isFromCurrentSeason(league: League, seasonId?: string): boolean {
    return league.season.id === seasonId;
  }
}
