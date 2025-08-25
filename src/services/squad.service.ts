import type { LeagueSquad, LeagueSquadCurrentTourInfo } from '@/gql';
import { PlayerService } from './player.service';

export class SquadService {
  /**
   *
   * @param leagueSquads
   * @returns
   */
  static getTourWinner(leagueSquads?: LeagueSquad[]): LeagueSquad | undefined {
    return leagueSquads?.find(squad => squad.scoreInfo.place === 1);
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

    PlayerService.recalculateGoalkeeperLiveScore(players);
    PlayerService.recalculateFieldPlayersLiveScore(players);
    PlayerService.recalculateViceCaptain(players);
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
        ? PlayerService.getSquadTourPlayersWithPointsCount(
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
