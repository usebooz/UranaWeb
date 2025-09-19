import type { Tour } from '@/gql';
import { FantasyTourStatus } from '@/gql/generated/graphql';

/**
 * Service for tournament round management and status checking
 */
export class TourService {
  /**
   *
   * @param tour - tour data
   * @param tours - array of tours
   * @returns
   */
  static isFromCurrentSeason(tour: Tour, tours?: Tour[]): boolean {
    return tours?.some(t => t.id === tour.id) || false;
  }

  /**
   *
   * @param tours
   * @returns
   */
  static filterAvailableTours(tours?: Tour[]): Tour[] | undefined {
    return tours?.filter(tour => TourService.isAvailable(tour));
  }

  /**
   * Gets selected tour
   * @param tourNumber
   * @param tours
   * @returns
   */
  static getTourIdByNumber(
    tourNumber: number,
    tours?: Tour[]
  ): string | undefined {
    return tours?.[tourNumber - 1].id;
  }

  /**
   *
   * @param tourId
   * @param tours
   * @returns
   */
  static getTourNumberById(
    tourId?: string,
    tours?: Tour[]
  ): number | undefined {
    const tourIndex = tours?.findIndex(tour => tour.id === tourId);
    if (!tourIndex || tourIndex < 0) {
      return undefined;
    }
    return tourIndex + 1;
  }

  /**
   * Gets selected tour by page number
   * @param tours
   * @returns selected tour or undefined
   */
  static findTourInProgress(tours?: Tour[]): Tour | undefined {
    return tours?.find(tour => TourService.isInProgress(tour));
  }

  /**
   * Filters available tours from a tours array
   * @param tours - array of tours
   * @returns array of available tours (finished, in progress, or opened)
   */
  static isAvailable(tour: Tour): boolean {
    return (
      tour.status === FantasyTourStatus.Finished ||
      tour.status === FantasyTourStatus.InProgress ||
      tour.status === FantasyTourStatus.Opened
    );
  }

  /**
   * Finds tour that is currently in progress from tours array
   * @param tours - array of tours
   * @returns tour in progress or undefined
   */
  static isInProgress(tour: Tour): boolean {
    return tour.status === FantasyTourStatus.InProgress;
  }

  /**
   * Checks if tour is opened (ready for registration)
   * @param tour - tour data
   * @returns true if tour status is Opened
   */
  static isOpened(tour: Tour): boolean {
    return tour.status === FantasyTourStatus.Opened;
  }

  /**
   * Checks if tour is finished
   * @param tour - tour data
   * @returns true if tour status is Finished
   */
  static isFinished(tour: Tour): boolean {
    return tour.status === FantasyTourStatus.Finished;
  }

  /**
   * Checks if tour score is available for display
   * @param tour - tour data
   * @returns true if tour is finished or in progress
   */
  static isScoreAvailable(tour: Tour): boolean {
    return this.isFinished(tour) || this.isInProgress(tour);
  }

  /**
   * Formats tour start date for display
   * @param tour - tour data
   * @returns formatted date string or undefined
   */
  static formatStartDate(tour: Tour): string | undefined {
    if (!tour.startedAt || typeof tour.startedAt !== 'string') {
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
   * Formats tour status text for display
   * @param tour - tour data
   * @returns localized status text or undefined
   */
  static formatStatus(tour: Tour): string | undefined {
    switch (tour.status) {
      case FantasyTourStatus.Finished:
        return 'закончен';
      case FantasyTourStatus.InProgress:
        return 'идет';
      case FantasyTourStatus.Opened:
      case FantasyTourStatus.NotStarted:
        return `стартует ${this.formatStartDate(tour)}`;
      default:
        return undefined;
    }
  }
}
