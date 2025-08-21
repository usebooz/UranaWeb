import type {
  League,
  Tour,
  LeagueSquads,
  LeagueSquadsPlayers,
  TourMatches,
} from '@/gql';
import { FantasyTourStatus, MatchStatus } from '@/gql/generated/graphql';
import { BadgeProps } from '@telegram-apps/telegram-ui';

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
    return league?.season?.currentTour?.id;
  }

  /**
   *
   * @param league - данные лиги
   * @param tour
   * @returns
   */
  static isTourCurrent(league: League, tour: Tour): boolean {
    return tour?.id === league?.season?.currentTour?.id;
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
   * Подсчитывает количество завершенных туров
   * @param league - данные лиги
   * @returns количество завершенных туров
   */
  static getToursHeader(league: League): string | undefined {
    if (!league) {
      return undefined;
    }

    const toursCount = league?.season.tours.filter(
      tour => tour.status === FantasyTourStatus.Finished
    ).length;

    return `Туров завершено: ${toursCount}`;
  }

  /**
   * Подсчитывает количество туров для пагинации (завершенные + текущий)
   * @param league - данные лиги
   * @returns количество туров для отображения в пагинации
   */
  static getAvailableToursCount(league: League): number {
    return (
      league?.season.tours.filter(
        tour =>
          tour.status === FantasyTourStatus.Finished ||
          tour.status === FantasyTourStatus.InProgress ||
          tour.status === FantasyTourStatus.Opened
      ).length || 0
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
   * Получает выбранный тур по номеру страницы
   * @param league - данные лиги
   * @param page - номер страницы (1-based)
   * @returns выбранный тур или undefined
   */
  static getTourByPage(league: League, page: number): Tour | undefined {
    return league?.season?.tours?.[page - 1];
  }

  /**
   *
   * @param leagueSquad
   * @returns
   */
  static getTopPercent(leagueSquad: LeagueSquads[0]): string | undefined {
    if (!leagueSquad.scoreInfo?.topPercent) {
      return undefined;
    }
    // Извлекаем числа из названия тура
    const regex = /\d+/;
    const match = regex.exec(leagueSquad.scoreInfo.topPercent);
    return (match ? match[0] : '0') + '%';
  }

  /**
   * Переводит статус тура в читаемый формат
   * @param tour
   * @returns читаемое описание статуса
   */
  static getTourStatusHint(tour: Tour): string | undefined {
    switch (tour?.status) {
      case FantasyTourStatus.Finished:
        return 'закончен';
      case FantasyTourStatus.InProgress:
        return 'идет';
      case FantasyTourStatus.Opened:
        return 'не начат';
      default:
        return undefined;
    }
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
   * @param tourMatches
   * @returns
   */
  static getPlayedMatchesCount(tourMatches?: TourMatches): string | undefined {
    if (!tourMatches) {
      return undefined;
    }

    const totalMatches = tourMatches.length;
    const playedMatches = tourMatches.filter(
      match =>
        match.matchStatus === MatchStatus.Closed ||
        match.matchStatus === MatchStatus.Ended
    ).length;

    return `сыграно матчей ${playedMatches}/${totalMatches}`;
  }

  /**
   * Получает информацию о победителе тура
   * @param leagueSquads - рейтинг команд лиги
   * @returns строка с информацией о победителе или undefined
   */
  static getTourWinner(leagueSquads?: LeagueSquads): string | undefined {
    const winner = leagueSquads?.find(squad => squad.scoreInfo.place === 1);
    if (!winner) {
      return undefined;
    }
    return `👑 ${winner.squad.user.nick}`;
  }

  /**
   * Форматирует дату и время старта тура
   * @param tour - данные тура
   * @returns отформатированная строка с датой старта или undefined
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
    return `стартует ${formatter.format(startDate)}`;
  }

  /**
   * Получает среднее значение очков из рейтинга команд
   * @param leagueSquads - данные команд лиги
   * @returns
   */
  static getAverageScore(
    tour: Tour,
    leagueSquads?: LeagueSquads
  ): string | undefined {
    if (FantasyService.isTourOpened(tour)) {
      return 'Очки';
    }
    if (!leagueSquads) {
      return '0';
    }
    const firstSquad = leagueSquads[0];
    return '∅' + (firstSquad?.scoreInfo?.averageScore ?? '0');
  }

  /**
   *
   * @param tour
   * @returns
   */
  static getAverageSubtitle(tour: Tour): string {
    return FantasyService.isTourOpened(tour) ? 'за сезон' : 'за тур';
  }

  /**
   * Получает общее количество команд из рейтинга
   * @param leagueSquads - данные команд лиги
   * @returns общее количество команд или 0
   */
  static getSquadsHeader(leagueSquads?: LeagueSquads): string | undefined {
    const firstSquad = leagueSquads?.[0];
    const squadsCount = firstSquad?.scoreInfo?.totalPlaces ?? 0;
    return `Команд участвует: ${squadsCount}`;
  }

  /**
   *
   * @param leagueSquad
   * @returns
   */
  static isSquadPlaceDiffNegative(leagueSquad: LeagueSquads[0]): boolean {
    return leagueSquad.scoreInfo.placeAfterTourDiff < 0;
  }

  /**
   * Форматирует разность мест для subtitle
   * @param leagueSquad
   * @returns отформатированная строка с префиксом + или -
   */
  static getSquadPlaceDiff(leagueSquad: LeagueSquads[0]): string | undefined {
    if (!leagueSquad.scoreInfo.placeAfterTourDiff) return undefined;
    return this.isSquadPlaceDiffNegative(leagueSquad)
      ? `${leagueSquad.scoreInfo.placeAfterTourDiff}`
      : `+${leagueSquad.scoreInfo.placeAfterTourDiff}`;
  }

  /**
   * Форматирует место команды с ведущими пробелами для выравнивания
   * @param leagueSquad - данные команды
   * @returns место команды с ведущими &nbsp; для одинаковой ширины
   */
  static getSquadPlace(tour: Tour, leagueSquad: LeagueSquads[0]): string {
    const place = FantasyService.isTourOpened(tour)
      ? leagueSquad.scoreInfo.place.toString()
      : leagueSquad.scoreInfo.placeAfterTour.toString();
    const totalPlaces = leagueSquad.scoreInfo.totalPlaces.toString();
    const targetWidth = totalPlaces.length;
    const currentWidth = place.length;

    if (currentWidth >= targetWidth) {
      return place;
    }

    const spacesNeeded = targetWidth - currentWidth;
    const leadingSpaces = '&nbsp;'.repeat(spacesNeeded);

    return `${leadingSpaces}${place}`;
  }

  /**
   *
   * @param tour
   * @param leagueSquad
   * @returns
   */
  static getSquadBadgeMode(
    tour: Tour,
    leagueSquad: LeagueSquads[0]
  ): BadgeProps['mode'] {
    if (FantasyService.isTourOpened(tour)) return 'secondary';
    return this.isSquadPlaceDiffNegative(leagueSquad) ? 'critical' : 'primary';
  }

  /**
   *
   * @param tour
   * @param leagueSquad
   * @returns
   */
  static getSquadBadge(
    tour: Tour,
    leagueSquad: LeagueSquads[0]
  ): string | undefined {
    return FantasyService.isTourOpened(tour)
      ? FantasyService.getTopPercent(leagueSquad)
      : FantasyService.getSquadPlaceDiff(leagueSquad);
  }

  /**
   *
   * @param squadPlayers
   * @returns
   */
  static getSquadDescription(
    squadPlayers?: LeagueSquadsPlayers[0]
  ): string | undefined {
    if (!squadPlayers?.squad.currentTourInfo) {
      return undefined;
    }

    const transfersDone =
      squadPlayers.squad.currentTourInfo.transfersDone.toString();
    const transfersTotal = squadPlayers.squad.currentTourInfo.isNotLimit
      ? '♾️'
      : (
          squadPlayers.squad.currentTourInfo.transfersDone +
          Number(squadPlayers.squad.currentTourInfo.transfersLeft)
        ).toString();
    return '🔄' + transfersDone + '/' + transfersTotal;
  }

  /**
   *
   * @param squadPlayers
   * @returns
   */
  static getSquadSubtitle(
    squadPlayers?: LeagueSquadsPlayers[0]
  ): string | undefined {
    if (!squadPlayers?.squad.currentTourInfo) {
      return undefined;
    }
  }

  /**
   *
   * @param leagueSquad - данные команды
   * @param tour - данные тура
   * @returns
   */
  static getTourScore(tour: Tour, leagueSquad: LeagueSquads[0]): string {
    if (!FantasyService.isTourOpened(tour)) {
      return leagueSquad.scoreInfo.score.toString();
    }

    return '∅' + (leagueSquad.scoreInfo.averageScore?.toString() ?? '0');
  }

  /**
   *
   * @param leagueSquad - данные команды
   * @param tour - данные тура
   * @returns
   */
  static getSeasonScore(tour: Tour, leagueSquad: LeagueSquads[0]): string {
    if (FantasyService.isTourOpened(tour)) {
      return leagueSquad.scoreInfo.score.toString();
    }

    return leagueSquad.scoreInfo.pointsAfterTour.toString();
  }

  /**
   * Получает subtitle для аккордеона тура в зависимости от статуса
   * @param tour - данные тура
   * @param leagueSquads - рейтинг команд (для определения победителя)
   * @returns текст для subtitle
   */
  static getTourSubtitle(
    tour: Tour,
    tourMathes?: TourMatches,
    leagueSquads?: LeagueSquads
  ): string | undefined {
    if (!tour) return undefined;

    switch (tour.status) {
      case FantasyTourStatus.Finished: {
        return this.getTourWinner(leagueSquads);
      }
      case FantasyTourStatus.InProgress: {
        return this.getPlayedMatchesCount(tourMathes);
      }
      case FantasyTourStatus.Opened: {
        return this.formatTourStartDate(tour);
      }
      default: {
        return undefined;
      }
    }
  }
}
