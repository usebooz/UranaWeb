import type { TourMatch } from '@/gql';
import { MatchLineupPlayerStatus } from '@/gql';
import { MatchStatus, StatPeriodId, StatWinner } from '@/gql/generated/graphql';

/**
 * Service for individual match operations and status management.
 * Handles match status checking, lineup operations, and player match statistics.
 */
export class MatchService {
  /** Emoji used to represent substitute players */
  static readonly subEmoji = '🪑';

  /**
   * Checks if match is currently in progress.
   *
   * @param match - The match data
   * @returns True if match status is Live
   */
  static isInProgress(match?: TourMatch): boolean {
    return match?.matchStatus === MatchStatus.Live;
  }

  /**
   * Checks if match score is available (match is live or finished).
   *
   * @param match - The match data
   * @returns True if score data is available
   */
  static isScoreAvailable(match?: TourMatch): boolean {
    return this.isInProgress(match) || this.isFinished(match);
  }

  /**
   * Checks if match has not started yet
   * @param match - match data
   * @returns true if match is not started, delayed, or postponed
   */
  static isNotStarted(match?: TourMatch): boolean {
    return (
      match?.matchStatus === MatchStatus.NotStarted ||
      match?.matchStatus === MatchStatus.StartDelayed ||
      match?.matchStatus === MatchStatus.Postponed
    );
  }

  /**
   * Checks if match is finished
   * @param match - match data
   * @returns true if match is closed or ended
   */
  static isFinished(match?: TourMatch): boolean {
    return (
      match?.matchStatus === MatchStatus.Closed ||
      match?.matchStatus === MatchStatus.Ended
    );
  }

  /**
   * Formats current match time for display
   * @param match - match data
   * @returns formatted time string or undefined
   */
  static formatCurrentTime(match: TourMatch): string | undefined {
    if (match.periodId === StatPeriodId.HalfTime) return 'перерыв';
    return `${match.currentTime}'`;
  }

  /**
   * Checks if home team won the match
   * @param match - match data
   * @returns true if match is finished and home team won
   */
  static isHomeWinner(match: TourMatch): boolean {
    return this.isFinished(match) && match.winner === StatWinner.Home;
  }

  /**
   * Checks if away team won the match
   * @param match - match data
   * @returns true if match is finished and away team won
   */
  static isAwayWinner(match: TourMatch): boolean {
    return this.isFinished(match) && match.winner === StatWinner.Away;
  }

  /**
   * Filters matches that have started (not waiting to start)
   * @param matches - array of tour matches
   * @returns array of started matches or undefined
   */
  static filterMatchesStarted(matches?: TourMatch[]): TourMatch[] | undefined {
    return matches?.filter(match => !this.isNotStarted(match));
  }

  /**
   * Finds a match where specified team is playing (home or away).
   *
   * @param matches - Array of tour matches to search in
   * @param teamId - ID of the team to find
   * @returns Match with the specified team or undefined if not found
   */
  static findMatchByTeamId(
    matches?: TourMatch[],
    teamId?: string
  ): TourMatch | undefined {
    return matches?.find(
      match =>
        match.home?.team?.id === teamId || match.away?.team?.id === teamId
    );
  }

  /**
   * Gets the lineup status of a player in a specific match.
   * Returns status as enum value or emoji representation.
   *
   * @param match - The match data containing lineup information
   * @param playerId - ID of the player to check
   * @param emoji - If true, returns emoji representation instead of enum
   * @returns Player's lineup status or undefined if player not found
   */
  static getLineupPlayerStatus(
    match?: TourMatch,
    playerId?: string,
    emoji = false
  ): MatchLineupPlayerStatus | undefined | string {
    if (!playerId || !match?.hasLineups) {
      return undefined;
    }

    const lineupHome = match.home?.lineup || [];
    const lineupAway = match.away?.lineup || [];
    const lineupPlayer = [...lineupHome, ...lineupAway].find(
      lp => lp?.player?.id === playerId
    );

    if (!lineupPlayer) {
      return emoji ? '❌' : MatchLineupPlayerStatus.NotInLineup;
    } else if (lineupPlayer.lineupStarting) {
      return emoji ? '✅' : MatchLineupPlayerStatus.Starting;
    } else {
      return emoji ? this.subEmoji : MatchLineupPlayerStatus.Substituted;
    }
  }

  /**
   * Checks if a player is included in the match lineup (starting or substitute).
   *
   * @param match - The match data containing lineup information
   * @param playerId - ID of the player to check
   * @returns True if player is in the lineup (starting or substitute)
   */
  static isPlayerInLineup(match?: TourMatch, playerId?: string): boolean {
    const status = this.getLineupPlayerStatus(match, playerId) as
      | MatchLineupPlayerStatus
      | undefined;
    return (
      status === MatchLineupPlayerStatus.Starting ||
      status === MatchLineupPlayerStatus.Substituted
    );
  }

  /**
   * Formats match scheduled time for display
   * @param match - match data
   * @returns formatted schedule string or undefined
   */
  static formatMatchScheduledAt(match: TourMatch): string | undefined {
    if (!match?.scheduledAt || typeof match.scheduledAt !== 'string') {
      return undefined;
    }

    const scheduledAt = new Date(match.scheduledAt);
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(scheduledAt);
  }
}
