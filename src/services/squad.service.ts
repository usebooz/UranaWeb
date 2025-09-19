import type { LeagueSquad, SquadTourInfo } from '@/gql';
import { PlayerService } from './player.service';

/**
 * Service for team/squad scoring and statistics operations
 */
export class SquadService {
  /**
   * Finds tour winner from squads
   * @param leagueSquads - array of league squads
   * @returns squad with first place or undefined
   */
  static findTourWinner(leagueSquads?: LeagueSquad[]): LeagueSquad | undefined {
    return leagueSquads?.find(squad => squad.scoreInfo.place === 1);
  }

  /**
   * Formats squads tour average score for display
   * @param leagueSquads - league squads data
   * @returns formatted average score with symbol or undefined
   */
  static formatSquadsTourAverageScore(
    leagueSquads?: LeagueSquad[]
  ): string | undefined {
    const firstSquad = leagueSquads?.[0];
    if (!firstSquad) {
      return undefined;
    }
    return this.formatAverageScore(firstSquad);
  }

  /**
   * Formats individual squad average score for display
   * @param leagueSquad - squad data
   * @returns formatted average score with symbol
   */
  static formatAverageScore(leagueSquad: LeagueSquad): string {
    return `∅${leagueSquad.scoreInfo.averageScore?.toString() ?? '0'}`;
  }

  /**
   * Gets total squads count from rating
   * @param leagueSquads - league squads data
   * @returns total squads count as string or undefined
   */
  static getSquadsCount(leagueSquads?: LeagueSquad[]): string | undefined {
    const firstSquad = leagueSquads?.[0];
    const squadsCount = firstSquad?.scoreInfo?.totalPlaces ?? 0;
    return squadsCount.toString();
  }

  /**
   * Checks if squad place difference is negative (position dropped)
   * @param leagueSquad - squad data
   * @returns true if place difference is negative
   */
  static isPlaceDiffNegative(leagueSquad: LeagueSquad): boolean {
    return leagueSquad.scoreInfo.placeAfterTourDiff < 0;
  }

  /**
   * Formats squad place difference with + or - symbol
   * @param leagueSquad - squad data
   * @returns formatted place difference string or undefined
   */
  static formatPlaceDiff(leagueSquad: LeagueSquad): string | undefined {
    if (!leagueSquad.scoreInfo.placeAfterTourDiff) return undefined;
    return this.isPlaceDiffNegative(leagueSquad)
      ? `${leagueSquad.scoreInfo.placeAfterTourDiff.toString().replace('-', '')}↓`
      : `${leagueSquad.scoreInfo.placeAfterTourDiff.toString()}↑`;
  }

  /**
   * Formats squad transfers total count
   * @param squadTourInfo - squad tour info
   * @returns formatted transfers total or undefined
   */
  static formatSquadTransfersTotal(
    squadTourInfo?: SquadTourInfo
  ): string | undefined {
    return squadTourInfo?.isNotLimit
      ? '∞'
      : (
          Number(squadTourInfo?.transfersDone) +
          Number(squadTourInfo?.transfersLeft)
        ).toString();
  }

  /**
   * Recalculates squad players live score during tour
   * @param squadCurrentTourInfo - squad current tour info
   */
  static recalculateSquadPlayersLiveScore(
    squadCurrentTourInfo?: SquadTourInfo
  ): void {
    if (!squadCurrentTourInfo) {
      return;
    }
    const players = squadCurrentTourInfo.players;

    PlayerService.recalculateGoalkeeperLiveScore(players);
    PlayerService.recalculateFieldPlayersLiveScore(players);
    PlayerService.recalculateViceCaptain(players);
  }

  // /**
  //  * Recalculates all squads live scores during tour
  //  * @param squads - array of league squads
  //  * @param squadsCurrentTourInfo - array of squads current tour info
  //  */
  // static recalculateSquadsLiveScore(
  //   squads: LeagueSquad[],
  //   squadsCurrentTourInfo?: SquadTourInfo[]
  // ): void {
  //   if (!squads?.length || !squadsCurrentTourInfo?.length) {
  //     return;
  //   }

  //   //1. Player scores without subs
  //   for (const tourInfo of squadsCurrentTourInfo) {
  //     this.recalculateSquadPlayersLiveScore(tourInfo);
  //   }

  //   let scoreSum = 0;
  //   for (const squad of squads) {
  //     //2. Restore total score
  //     squad.scoreInfo.pointsAfterTour = squad.squad.seasonScoreInfo?.score
  //       ? squad.squad.seasonScoreInfo?.score - squad.scoreInfo.score
  //       : 0;

  //     //3. Calculate new squad tour score as a sum of player scores
  //     const tourInfo = squadsCurrentTourInfo.find(s => s.id === squad.squad.id);
  //     squad.scoreInfo.score = tourInfo
  //       ? PlayerService.filterPlayersWithPointsCount(tourInfo.players).reduce(
  //           (sum, p) => sum + (p.points || 0),
  //           0
  //         )
  //       : 0;

  //     //4. Sum for average
  //     scoreSum += squad.scoreInfo.score;
  //   }

  //   const averageScore = scoreSum / squads.length;
  //   squads = squads.sort(
  //     (a, b) => b.scoreInfo.pointsAfterTour - a.scoreInfo.pointsAfterTour
  //   );
  //   let place = 0,
  //     pointsPrev = 0;
  //   for (const squad of squads) {
  //     //5. Restore place
  //     if (squad.scoreInfo.pointsAfterTour !== pointsPrev) {
  //       place++;
  //     }
  //     squad.scoreInfo.placeAfterTour = place;
  //     pointsPrev = squad.scoreInfo.pointsAfterTour;

  //     //6. Add new squad tour score to total score
  //     squad.scoreInfo.pointsAfterTour += squad.scoreInfo.score;

  //     //7. Average score
  //     squad.scoreInfo.averageScore = averageScore;
  //   }

  //   squads = squads.sort(
  //     (a, b) => b.scoreInfo.pointsAfterTour - a.scoreInfo.pointsAfterTour
  //   );
  //   place = 0;
  //   pointsPrev = 0;
  //   for (const squad of squads) {
  //     //6. Calculate new place with diff
  //     if (squad.scoreInfo.pointsAfterTour !== pointsPrev) {
  //       place++;
  //     }
  //     squad.scoreInfo.placeAfterTourDiff =
  //       squad.scoreInfo.placeAfterTour - place;
  //     squad.scoreInfo.placeAfterTour = place;
  //     pointsPrev = squad.scoreInfo.pointsAfterTour;
  //   }
  // }
}
