import type { League, Tour } from '@/gql';
import { FantasyTourStatus, MatchStatus } from '@/gql/generated/graphql';

/**
 * Сервис для работы с fantasy данными
 */
export class FantasyService {
  /**
   * Определяет текущий активный тур из лиги
   * @param league - данные лиги
   * @returns ID текущего тура или null
   */
  static getCurrentTourId(league: League): string | undefined {
    if (!league?.season) return undefined;

    const { currentTour, tours } = league.season;

    // Если есть currentTour и его статус FINISHED или IN_PROGRESS - используем его
    if (
      currentTour &&
      (currentTour.status === FantasyTourStatus.Finished ||
        currentTour.status === FantasyTourStatus.InProgress)
    ) {
      return currentTour.id;
    }

    // Иначе ищем предыдущий тур (currentTour - 1)
    if (tours && tours.length > 0) {
      const currentTourIndex = tours.findIndex(
        tour => tour.id === currentTour?.id
      );
      if (currentTourIndex > 0) {
        return tours[currentTourIndex - 1].id;
      }
      // Если currentTour не найден или это первый тур, возвращаем первый доступный
      return tours[0].id;
    }

    return undefined;
  }

  /**
   * Подсчитывает количество завершенных туров
   * @param league - данные лиги
   * @returns количество завершенных туров
   */
  static getFinishedToursCount(league: League | undefined): number {
    if (!league?.season?.tours) return 0;

    return league.season.tours.filter(
      tour => tour.status === FantasyTourStatus.Finished
    ).length;
  }

  /**
   * Подсчитывает количество туров для пагинации (завершенные + текущий)
   * @param league - данные лиги
   * @returns количество туров для отображения в пагинации
   */
  static getAvailableToursCount(league: League | undefined): number {
    if (!league?.season?.tours) return 0;

    return league.season.tours.filter(
      tour =>
        tour.status === FantasyTourStatus.Finished ||
        tour.status === FantasyTourStatus.InProgress
    ).length;
  }

  /**
   * Извлекает номер тура из названия (убирает слово "тур")
   * @param tour - данные тура
   * @returns номер тура как число
   */
  static getTourNumber(tour: Tour | undefined): number {
    if (!tour?.name) return 1;

    // Извлекаем числа из названия тура
    const regex = /\d+/;
    const match = regex.exec(tour.name);
    return match ? parseInt(match[0], 10) : 1;
  }

  /**
   * Переводит статус тура в читаемый формат
   * @param status - статус тура
   * @returns читаемое описание статуса
   */
  static getTourStatusHint(status: FantasyTourStatus): string {
    switch (status) {
      case FantasyTourStatus.Finished:
        return 'закончен';
      case FantasyTourStatus.InProgress:
        return 'идет';
      default:
        return 'не начат';
    }
  }

  /**
   * Определяет, нужно ли показывать badge для тура
   * @param status - статус тура
   * @returns true если нужно показать badge
   */
  static shouldShowTourBadge(status: FantasyTourStatus): boolean {
    return status === FantasyTourStatus.InProgress;
  }

  /**
   * Подсчитывает количество сыгранных матчей в туре
   * @param tour - данные тура
   * @returns строка вида "5/6" (сыграно/всего)
   */
  static getPlayedMatchesCount(tour: Tour | undefined): string {
    if (!tour?.matches) return '0/0';

    const totalMatches = tour.matches.length;
    const playedMatches = tour.matches.filter(
      match =>
        match.status === MatchStatus.Closed ||
        match.status === MatchStatus.Ended
    ).length;

    return `${playedMatches}/${totalMatches}`;
  }
}
