import type { TourMatch } from '@/gql';
import { MatchStatus, StatPeriodId, StatWinner } from '@/gql/generated/graphql';

export class MatchService {
  /**
   *
   * @param match
   * @returns
   */
  static isMatchInProgress(match: TourMatch): boolean {
    return match?.matchStatus === MatchStatus.Live;
  }

  /**
   *
   * @param match
   * @returns
   */
  static isMatchNotStarted(match: TourMatch): boolean {
    return (
      match?.matchStatus === MatchStatus.NotStarted ||
      match?.matchStatus === MatchStatus.StartDelayed ||
      match?.matchStatus === MatchStatus.Postponed
    );
  }

  /**
   *
   * @param match
   * @returns
   */
  static isMatchFinished(match: TourMatch): boolean {
    return (
      match?.matchStatus === MatchStatus.Closed ||
      match?.matchStatus === MatchStatus.Ended
    );
  }

  /**
   *
   * @param match
   * @returns
   */
  static getMatchCurrentTime(match: TourMatch): string | undefined {
    if (match.periodId === StatPeriodId.HalfTime) return 'перерыв';
    return `${match.currentTime}'`;
  }

  /**
   *
   * @param match
   * @returns
   */
  static isMatctHomeWinner(match: TourMatch): boolean {
    return this.isMatchFinished(match) && match.winner === StatWinner.Home;
  }

  /**
   *
   * @param match
   * @returns
   */
  static isMatctAwayWinner(match: TourMatch): boolean {
    return this.isMatchFinished(match) && match.winner === StatWinner.Away;
  }

  /**
   *
   * @param matches
   * @returns
   */
  static getMatchesStartedCount(matches?: TourMatch[]): string | undefined {
    return matches
      ?.filter(match => !this.isMatchNotStarted(match))
      .length.toString();
  }

  /**
   *
   * @param match
   * @returns
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
