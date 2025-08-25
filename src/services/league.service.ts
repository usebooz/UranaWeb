import type { League, Tour } from '@/gql';
import { TourService } from './tour.service';

export class LeagueService {
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;
  /**
   *
   * @param league
   * @returns
   */
  static getCurrentTourId(league: League): string | undefined {
    const tourInProgress = league?.season.tours.find(tour =>
      TourService.isTourInProgress(tour)
    );

    return tourInProgress?.id || league?.season?.currentTour?.id;
  }

  /**
   *
   * @param league
   * @returns
   */
  static isLeagueFromActiveRplSeason(league: League): boolean {
    return !!(
      league?.season.isActive &&
      league.season.tournament.webName === this.rplWebname
    );
  }

  /**
   * Получает ID сезона из лиги
   * @param league - данные лиги
   * @returns ID сезона или пустая строка
   */
  static getSeasonId(league: League): string | undefined {
    return league?.season?.id;
  }

  /**
   * Подсчитывает количество туров для пагинации (завершенные + текущий)
   * @param league - данные лиги
   * @returns количество туров для отображения в пагинации
   */
  static getAvailableToursCount(league: League): number {
    return (
      league?.season.tours.filter(tour => TourService.isTourAvailable(tour))
        .length || 0
    );
  }

  /**
   * Получает выбранный тур по номеру страницы
   * @param league - данные лиги
   * @param page - номер страницы (1-based)
   * @returns выбранный тур или undefined
   */
  static getTourByPage(league: League, page: number): Tour | undefined {
    return league?.season?.tours?.[page - 1];
  }
}
