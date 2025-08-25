import type { Tour } from '@/gql';
import { FantasyTourStatus } from '@/gql/generated/graphql';

/**
 * Service for tournament round management and status checking
 */
export class TourService {
  /**
   * Checks if tour belongs to league
   * @param tour - tour data
   * @param leagueTours - array of league tours
   * @returns true if tour belongs to league
   */
  static isFromLeague(tour: Tour, leagueTours?: Tour[]): boolean {
    return leagueTours?.some(t => t?.id === tour?.id) || false;
  }

  /**
   *
   * @param tours
   * @returns
   */
  static filterAvailableTours(tours: Tour[]): Tour[] {
    return tours.filter(tour => TourService.isAvailable(tour));
  }

  /**
   * Gets selected tour by page number
   * @param page - page number (1-based)
   * @param tours
   * @returns selected tour or undefined
   */
  static findTourByPage(page: number, tours?: Tour[]): Tour | undefined {
    return tours?.[page - 1];
  }

  /**
   * Gets selected tour by page number
   * @param tours
   * @returns selected tour or undefined
   */
  static findTouInProgress(tours?: Tour[]): Tour | undefined {
    return tours?.find(tour => TourService.isInProgress(tour));
  }

  /**
   * Filters available tours from a tours array
   * @param tours - array of tours
   * @returns array of available tours (finished, in progress, or opened)
   */
  static isAvailable(tour: Tour): boolean {
    return (
      tour?.status === FantasyTourStatus.Finished ||
      tour?.status === FantasyTourStatus.InProgress ||
      tour?.status === FantasyTourStatus.Opened
    );
  }

  /**
   * Finds tour by page number from tours array
   * @param page - page number (1-based index)
   * @param tours - array of tours
   * @returns selected tour or undefined
   */
  static extractNumber(tour: Tour): number {
    if (!tour) {
      return 0;
    }
    // Extract numbers from tour name
    const regex = /\d+/;
    const match = regex.exec(tour.name);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Finds tour that is currently in progress from tours array
   * @param tours - array of tours
   * @returns tour in progress or undefined
   */
  static isInProgress(tour: Tour): boolean {
    return tour?.status === FantasyTourStatus.InProgress;
  }

  /**
   * Checks if tour is opened (ready for registration)
   * @param tour - tour data
   * @returns true if tour status is Opened
   */
  static isOpened(tour: Tour): boolean {
    return tour?.status === FantasyTourStatus.Opened;
  }

  /**
   * Checks if tour is finished
   * @param tour - tour data
   * @returns true if tour status is Finished
   */
  static isFinished(tour: Tour): boolean {
    return tour?.status === FantasyTourStatus.Finished;
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
   * Formats tour status text for display
   * @param tour - tour data
   * @returns localized status text or undefined
   */
  static formatStatus(tour: Tour): string | undefined {
    switch (tour?.status) {
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
