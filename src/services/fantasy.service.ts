import type {
  League,
  Tour,
  LeagueSquads,
  LeagueSquadsPlayers,
  TourMatches,
} from '@/gql';
import {
  FantasyTourStatus,
  MatchStatus,
  StatPeriodId,
  StatWinner,
} from '@/gql/generated/graphql';
import { BadgeProps } from '@telegram-apps/telegram-ui';

/**
 * Сервис для работы с fantasy данными
 */
export class FantasyService {
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;
  static readonly skeletonText = '░░░░░░░░░░';

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
   *
   * @param league
   * @param tour
   * @returns
   */
  static isTourFromLeague(league: League, tour: Tour): boolean {
    return league?.season?.tours?.some(t => t.id === tour?.id) || false;
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
   * Подсчитывает количество туров для пагинации (завершенные + текущий)
   * @param league - данные лиги
   * @returns количество туров для отображения в пагинации
   */
  static getAvailableToursCount(league: League): number {
    return (
      league?.season.tours.filter(tour => this.isTourAvailable(tour)).length ||
      0
    );
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
   *
   * @param match
   * @returns
   */
  static isMatchInProgress(match: TourMatches[0]): boolean {
    return match?.matchStatus === MatchStatus.Live;
  }

  /**
   *
   * @param match
   * @returns
   */
  static isMatchNotStarted(match: TourMatches[0]): boolean {
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
  static isMatchFinished(match: TourMatches[0]): boolean {
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
  static getMatchCurrentTime(match: TourMatches[0]): string | undefined {
    if (match.periodId === StatPeriodId.HalfTime) return 'перерыв';
    return `${match.currentTime}'`;
  }

  /**
   *
   * @param match
   * @returns
   */
  static isMatctHomeWinner(match: TourMatches[0]): boolean {
    return this.isMatchFinished(match) && match.winner === StatWinner.Home;
  }

  /**
   *
   * @param match
   * @returns
   */
  static isMatctAwayWinner(match: TourMatches[0]): boolean {
    return this.isMatchFinished(match) && match.winner === StatWinner.Away;
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
   * @param tourMatches
   * @returns
   */
  static getPlayedMatchesCount(tourMatches?: TourMatches): string {
    if (!tourMatches) {
      return this.skeletonText;
    }

    const totalMatches = tourMatches.length;
    const playedMatches = tourMatches.filter(match =>
      this.isMatchFinished(match)
    ).length;

    return `${playedMatches}/${totalMatches}`;
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
   * @param leagueSquads
   * @returns
   */
  static getTourWinner(
    tour: Tour,
    leagueSquads?: LeagueSquads
  ): string | undefined {
    const tourWinner = leagueSquads?.find(squad => squad.scoreInfo.place === 1);
    if (!tourWinner) {
      return undefined;
    }

    const winnerName = `${tourWinner.squad.name} (${tourWinner.scoreInfo.score})`;
    return this.isTourFinished(tour) ? `👑 ${winnerName}` : winnerName;
  }

  /**
   *
   * @param tour
   * @returns
   */
  static formatTourStartDate(tour: Tour): string {
    if (!tour?.startedAt || typeof tour.startedAt !== 'string') {
      return this.skeletonText;
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
   * @param match
   * @returns
   */
  static formatMatchScheduledAt(match: TourMatches[0]): string | undefined {
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

  /**
   * Получает среднее значение очков из рейтинга команд
   * @param leagueSquads - данные команд лиги
   * @returns
   */
  static getTourAverageScore(leagueSquads?: LeagueSquads): string {
    const firstSquad = leagueSquads?.[0];
    return '∅' + (firstSquad?.scoreInfo?.averageScore ?? '0');
  }

  /**
   * Получает общее количество команд из рейтинга
   * @param leagueSquads - данные команд лиги
   * @returns общее количество команд или 0
   */
  static getSquadsCount(leagueSquads?: LeagueSquads): string | undefined {
    const firstSquad = leagueSquads?.[0];
    const squadsCount = firstSquad?.scoreInfo?.totalPlaces ?? 0;
    return squadsCount.toString();
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
    const place = this.isTourOpened(tour)
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
    if (this.isTourOpened(tour)) return 'secondary';
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
    return this.isTourOpened(tour)
      ? this.getTopPercent(leagueSquad)
      : this.getSquadPlaceDiff(leagueSquad);
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
    if (!this.isTourOpened(tour)) {
      return leagueSquad.scoreInfo.score.toString();
    }

    return '∅' + (leagueSquad.scoreInfo.averageScore?.toString() ?? '0');
  }

  /**
   *
   * @param tour
   * @returns
   */
  static getTourStatusText(tour: Tour): string {
    switch (tour?.status) {
      case FantasyTourStatus.Finished:
        return 'закончен';
      case FantasyTourStatus.InProgress:
        return 'идет';
      case FantasyTourStatus.Opened:
      case FantasyTourStatus.NotStarted:
        return `стартует ${FantasyService.formatTourStartDate(tour)}`;
      default:
        return FantasyService.skeletonText;
    }
  }

  /**
   *
   * @param leagueSquad - данные команды
   * @param tour - данные тура
   * @returns
   */
  static getSeasonScore(tour: Tour, leagueSquad: LeagueSquads[0]): string {
    if (this.isTourOpened(tour)) {
      return leagueSquad.scoreInfo.score.toString();
    }

    return leagueSquad.scoreInfo.pointsAfterTour.toString();
  }
}
