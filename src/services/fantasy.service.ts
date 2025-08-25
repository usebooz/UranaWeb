import type {
  League,
  Tour,
  LeagueSquad,
  LeagueSquadCurrentTourInfo,
  TourMatch,
  SquadTourPlayer,
} from '@/gql';
import {
  FantasyTourStatus,
  MatchStatus,
  StatPeriodId,
  StatWinner,
  FantasyPlayerRole,
} from '@/gql/generated/graphql';

/**
 * Сервис для работы с fantasy данными
 */
export class FantasyService {
  static readonly rplWebname = import.meta.env
    .VITE_SPORTS_TOURNAMENT_RPL as string;
  static readonly skeletonText = '░░░░░░░░░░';

  /**
   *
   * @param league
   * @returns
   */
  static getCurrentTourId(league: League): string | undefined {
    const tourInProgress = league?.season.tours.find(tour =>
      this.isTourInProgress(tour)
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
   *
   * @param tour
   * @param leagueTours
   * @returns
   */
  static isTourFromLeague(tour: Tour, leagueTours?: Tour[]): boolean {
    return leagueTours?.some(t => t?.id === tour?.id) || false;
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
  static getMatchesStartedCount(tourMatches?: TourMatch[]): string | undefined {
    return tourMatches
      ?.filter(match => !this.isMatchNotStarted(match))
      .length.toString();
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
   * @param leagueSquads
   * @returns
   */
  static getTourWinner(leagueSquads?: LeagueSquad[]): LeagueSquad | undefined {
    return leagueSquads?.find(squad => squad.scoreInfo.place === 1);
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

  /**
   * Получает среднее значение очков из рейтинга команд
   * @param leagueSquads - данные команд лиги
   * @returns
   */
  static getTourAverageScore(leagueSquads?: LeagueSquad[]): string {
    const firstSquad = leagueSquads?.[0];
    return '∅' + (firstSquad?.scoreInfo?.averageScore ?? '0');
  }

  /**
   * Получает общее количество команд из рейтинга
   * @param leagueSquads - данные команд лиги
   * @returns общее количество команд или 0
   */
  static getSquadsCount(leagueSquads?: LeagueSquad[]): string | undefined {
    const firstSquad = leagueSquads?.[0];
    const squadsCount = firstSquad?.scoreInfo?.totalPlaces ?? 0;
    return squadsCount.toString();
  }

  /**
   *
   * @param leagueSquad
   * @returns
   */
  static isSquadPlaceDiffNegative(leagueSquad: LeagueSquad): boolean {
    return leagueSquad.scoreInfo.placeAfterTourDiff < 0;
  }

  /**
   *
   * @param leagueSquad
   * @returns
   */
  static formatSquadPlaceDiff(leagueSquad: LeagueSquad): string | undefined {
    if (!leagueSquad.scoreInfo.placeAfterTourDiff) return undefined;
    return this.isSquadPlaceDiffNegative(leagueSquad)
      ? `${leagueSquad.scoreInfo.placeAfterTourDiff.toString().replace('-', '')}-`
      : `${leagueSquad.scoreInfo.placeAfterTourDiff.toString()}+`;
  }

  /**
   *
   * @param leagueSquad
   * @returns
   */
  static formatSquadAverageScore(leagueSquad: LeagueSquad): string {
    return `∅${leagueSquad.scoreInfo.averageScore?.toString() ?? '0'}`;
  }

  /**
   *
   * @param squadTourInfo
   * @returns
   */
  static formatSquadTransfersTotal(
    squadTourInfo?: LeagueSquadCurrentTourInfo
  ): string | undefined {
    return squadTourInfo?.squad.currentTourInfo?.isNotLimit
      ? '∞'
      : (
          Number(squadTourInfo?.squad.currentTourInfo?.transfersDone) +
          Number(squadTourInfo?.squad.currentTourInfo?.transfersLeft)
        ).toString();
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
   * @param squadCurrentTourInfo
   * @returns
   */
  static recalculateSquadPlayersLiveScore(
    squadCurrentTourInfo?: LeagueSquadCurrentTourInfo
  ): void {
    if (!squadCurrentTourInfo?.squad.currentTourInfo) {
      return;
    }
    const players = squadCurrentTourInfo.squad.currentTourInfo.players;

    this.recalculateGoalkeeperLiveScore(players);
    this.recalculateFieldPlayersLiveScore(players);
    this.recalculateViceCaptain(players);
  }

  /**
   *
   * @param player
   * @returns
   */
  static isSquadTourPlayerPointsCount(player: SquadTourPlayer): boolean {
    return player.isPointsCount;
  }

  /**
   *
   * @param player
   * @returns
   */
  static isSquadTourPlayerTeamPlayed(player: SquadTourPlayer): boolean {
    return player.playedMatchesTour > 0;
  }

  /**
   *
   * @param player
   * @returns
   */
  static isSquadTourPlayerNotPlayedInMatch(player: SquadTourPlayer): boolean {
    return (
      this.isSquadTourPlayerTeamPlayed(player) &&
      !this.isSquadTourPlayerPointsCount(player)
    );
  }

  /**
   *
   * @param player
   * @returns
   */
  static isSquadTourFieldPlayer(player: SquadTourPlayer): boolean {
    return player.seasonPlayer.role !== FantasyPlayerRole.Goalkeeper;
  }

  /**
   *
   * @param player
   * @returns
   */
  static isSquadTourStartPlayer(player: SquadTourPlayer): boolean {
    return player.isStarting;
  }

  /**
   *
   * @param players
   * @returns
   */
  static getSquadTourFieldPlayersOnBench(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players
      .filter(
        p => this.isSquadTourFieldPlayer(p) && !this.isSquadTourStartPlayer(p)
      )
      .sort(
        (a, b) => (a.substitutePriority || 0) - (b.substitutePriority || 0)
      );
  }

  /**
   *
   * @param players
   * @returns
   */
  static getSquadTourStartPlayersFormation(
    players: SquadTourPlayer[]
  ): Record<string, number> {
    const formation: Record<string, number> = {};

    players
      .filter(p => this.isSquadTourStartPlayer(p))
      .forEach(p => {
        const role = p.seasonPlayer.role;
        formation[role] = (formation[role] || 0) + 1;
      });

    return formation;
  }

  /**
   *
   * @param players
   * @returns
   */
  static getSquadTourStartFieldPlayersNotPlayed(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players.filter(
      p =>
        this.isSquadTourStartPlayer(p) &&
        this.isSquadTourFieldPlayer(p) &&
        this.isSquadTourPlayerNotPlayedInMatch(p)
    );
  }

  /**
   *
   * @param players
   * @returns
   */
  static getSquadTourPlayersWithPointsCount(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players.filter(p => this.isSquadTourPlayerPointsCount(p));
  }

  /**
   *
   */
  private static recalculateViceCaptain(players: SquadTourPlayer[]): void {
    const viceCaptain = players.find(p => p.isViceCaptain);
    const captain = players.find(p => p.isCaptain);
    if (!viceCaptain || !captain) return;
    if (
      !this.isSquadTourPlayerPointsCount(viceCaptain) ||
      this.isSquadTourPlayerNotPlayedInMatch(captain)
    )
      return;

    viceCaptain.points = viceCaptain.score =
      viceCaptain.statPlayer?.points || 0;
  }

  /**
   *
   */
  private static recalculateGoalkeeperLiveScore(
    players: SquadTourPlayer[]
  ): void {
    const goalkeeperOnBench = players.find(
      p => !this.isSquadTourFieldPlayer(p) && !this.isSquadTourStartPlayer(p)
    );
    if (!goalkeeperOnBench) return;
    if (!this.isSquadTourPlayerPointsCount(goalkeeperOnBench)) {
      goalkeeperOnBench.points = 0;
      return;
    }

    const goalkeeperInStarting = players.find(
      p => !this.isSquadTourFieldPlayer(p) && this.isSquadTourStartPlayer(p)
    );
    if (
      !goalkeeperInStarting ||
      this.isSquadTourPlayerNotPlayedInMatch(goalkeeperInStarting)
    )
      return;

    goalkeeperOnBench.isPointsCount = false;
  }

  /**
   *
   */
  private static recalculateFieldPlayersLiveScore(
    players: SquadTourPlayer[]
  ): void {
    const fieldPlayersOnBench = this.getSquadTourFieldPlayersOnBench(players);
    for (const substitutePlayer of fieldPlayersOnBench) {
      if (!this.isSquadTourPlayerPointsCount(substitutePlayer)) {
        substitutePlayer.points = 0;
        continue;
      }
      substitutePlayer.isPointsCount = false;
    }
  }

  /**
   * @param squads
   * @param squadsCurrentTourInfo
   */
  static recalculateSquadsLiveScore(
    squads: LeagueSquad[],
    squadsCurrentTourInfo?: LeagueSquadCurrentTourInfo[]
  ): void {
    if (!squads?.length || !squadsCurrentTourInfo?.length) {
      return;
    }

    //1. Player scores without subs
    for (const tourInfo of squadsCurrentTourInfo) {
      this.recalculateSquadPlayersLiveScore(tourInfo);
    }

    let scoreSum = 0;
    for (const squad of squads) {
      //2. Restore total score
      squad.scoreInfo.pointsAfterTour = squad.squad.seasonScoreInfo?.score
        ? squad.squad.seasonScoreInfo?.score - squad.scoreInfo.score
        : 0;

      //3. Calculate new squad tour score as a sum of player scores
      const tourInfo = squadsCurrentTourInfo.find(
        s => s.squad.id === squad.squad.id
      );
      squad.scoreInfo.score = tourInfo?.squad.currentTourInfo
        ? this.getSquadTourPlayersWithPointsCount(
            tourInfo.squad.currentTourInfo.players
          ).reduce((sum, p) => sum + (p.points || 0), 0)
        : 0;

      //4. Sum for average
      scoreSum += squad.scoreInfo.score;
    }

    const averageScore = scoreSum / squads.length;
    squads = squads.sort(
      (a, b) => b.scoreInfo.pointsAfterTour - a.scoreInfo.pointsAfterTour
    );
    let place = 0,
      pointsPrev = 0;
    for (const squad of squads) {
      //5. Restore place
      if (squad.scoreInfo.pointsAfterTour !== pointsPrev) {
        place++;
      }
      squad.scoreInfo.placeAfterTour = place;
      pointsPrev = squad.scoreInfo.pointsAfterTour;

      //6. Add new squad tour score to total score
      squad.scoreInfo.pointsAfterTour += squad.scoreInfo.score;

      //7. Average score
      squad.scoreInfo.averageScore = averageScore;
    }

    squads = squads.sort(
      (a, b) => b.scoreInfo.pointsAfterTour - a.scoreInfo.pointsAfterTour
    );
    place = 0;
    pointsPrev = 0;
    for (const squad of squads) {
      //6. Calculate new place with diff
      if (squad.scoreInfo.pointsAfterTour !== pointsPrev) {
        place++;
      }
      squad.scoreInfo.placeAfterTourDiff =
        squad.scoreInfo.placeAfterTour - place;
      squad.scoreInfo.placeAfterTour = place;
      pointsPrev = squad.scoreInfo.pointsAfterTour;
    }
  }
}
