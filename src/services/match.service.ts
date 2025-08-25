import type { TourMatch } from '@/gql';
import { MatchStatus, StatPeriodId, StatWinner } from '@/gql/generated/graphql';

/**
 * Service for individual match operations and status management
 */
export class MatchService {
  /**
   * Checks if match is currently in progress
   * @param match - match data
   * @returns true if match status is Live
   */
  static isInProgress(match: TourMatch): boolean {
    return match?.matchStatus === MatchStatus.Live;
  }

  /**
   * Checks if match has not started yet
   * @param match - match data
   * @returns true if match is not started, delayed, or postponed
   */
  static isNotStarted(match: TourMatch): boolean {
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
  static isFinished(match: TourMatch): boolean {
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
