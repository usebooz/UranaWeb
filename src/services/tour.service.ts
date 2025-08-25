import type { Tour } from '@/gql';
import { FantasyTourStatus } from '@/gql/generated/graphql';

export class TourService {
  /**
   *
   * @param tour
   * @param leagueTours
   * @returns
   */
  static isTourFromLeague(tour: Tour, leagueTours?: Tour[]): boolean {
    return leagueTours?.some(t => t?.id === tour?.id) || false;
  }

  /**
   *
   * @param tour
   * @returns
   */
  static isTourAvailable(tour: Tour): boolean {
    return (
      tour?.status === FantasyTourStatus.Finished ||
      tour?.status === FantasyTourStatus.InProgress ||
      tour?.status === FantasyTourStatus.Opened
    );
  }

  /**
   * Извлекает номер тура из названия (убирает слово "тур")
   * @param tour - данные тура
   * @returns номер тура как число
   */
  static getTourNumber(tour: Tour): number {
    if (!tour) {
      return 0;
    }
    // Извлекаем числа из названия тура
    const regex = /\d+/;
    const match = regex.exec(tour.name);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   *
   * @param tour
   * @returns
   */
  static isTourInProgress(tour: Tour): boolean {
    return tour?.status === FantasyTourStatus.InProgress;
  }

  /**
   *
   * @param tour
   * @returns
   */
  static isTourOpened(tour: Tour): boolean {
    return tour?.status === FantasyTourStatus.Opened;
  }

  /**
   *
   * @param tour
   * @returns
   */
  static isTourFinished(tour: Tour): boolean {
    return tour?.status === FantasyTourStatus.Finished;
  }

  /**
   *
   * @param tour
   * @returns
   */
  static isTourScoreAvailable(tour: Tour): boolean {
    return this.isTourFinished(tour) || this.isTourInProgress(tour);
  }

  /**
   *
   * @param tour
   * @returns
   */
  static formatTourStartDate(tour: Tour): string | undefined {
    if (!tour?.startedAt || typeof tour.startedAt !== 'string') {
      return undefined;
    }

    const startDate = new Date(tour.startedAt);
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(startDate);
  }

  /**
   *
   * @param tour
   * @returns
   */
  static getTourStatusText(tour: Tour): string | undefined {
    switch (tour?.status) {
      case FantasyTourStatus.Finished:
        return 'закончен';
      case FantasyTourStatus.InProgress:
        return 'идет';
      case FantasyTourStatus.Opened:
      case FantasyTourStatus.NotStarted:
        return `стартует ${this.formatTourStartDate(tour)}`;
      default:
        return undefined;
    }
  }
}
