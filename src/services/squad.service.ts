import type {
  LeagueSquad,
  LeagueSquadWithCurrentTourInfo,
  SquadTourInfo,
} from '@/gql';
import { FieldFunctionOptions, Reference } from '@apollo/client';
import { PlayerService } from './player.service';

/**
 * Service for team/squad scoring and statistics operations
 */
export class SquadService {
  /**
   *
   * @param
   * @returns
   */
  static getSeasonScoreInfo(
    squad: LeagueSquad['squad']
  ): LeagueSquad['squad']['seasonScoreInfo'] {
    return squad.seasonScoreInfo;
  }
  /**
   *
   * @param
   * @returns
   */
  static getCurrentTourInfo(
    squad: LeagueSquadWithCurrentTourInfo['squad']
  ): LeagueSquadWithCurrentTourInfo['squad']['currentTourInfo'] {
    return squad.currentTourInfo;
  }

  /**
   *
   * @param leagueSquads
   * @returns
   */
  static findTourWinner(leagueSquads?: LeagueSquad[]): LeagueSquad | undefined {
    return leagueSquads?.find(leagueSquad => leagueSquad.scoreInfo.place === 1);
  }

  /**
   *
   * @param leagueSquads
   * @returns
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
   *
   * @param leagueSquad
   * @returns
   */
  static formatAverageScore(leagueSquad: LeagueSquad): string {
    return `∅${leagueSquad.scoreInfo.averageScore?.toString() ?? '0'}`;
  }

  /**
   *
   * @param leagueSquads
   * @returns
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
  static isPlaceDiffNegative(leagueSquad: LeagueSquad): boolean {
    return leagueSquad.scoreInfo.placeAfterTourDiff < 0;
  }

  /**
   *
   * @param leagueSquad
   * @returns
   */
  static formatPlaceDiff(leagueSquad: LeagueSquad): string | undefined {
    if (!leagueSquad.scoreInfo.placeAfterTourDiff) return undefined;
    return this.isPlaceDiffNegative(leagueSquad)
      ? `${leagueSquad.scoreInfo.placeAfterTourDiff.toString().replace('-', '')}↓`
      : `${leagueSquad.scoreInfo.placeAfterTourDiff.toString()}↑`;
  }

  /**
   *
   * @param
   * @returns
   */
  static formatSquadTop(squad: LeagueSquad): string | undefined {
    const place = squad.squad.seasonScoreInfo?.place;
    const totalPlaces = squad.squad.seasonScoreInfo?.totalPlaces;

    if (!place || !totalPlaces) {
      return undefined;
    }

    const positionPercentage = (place / totalPlaces) * 100;

    if (place === 1) {
      return '🥇';
    } else if (place === 2) {
      return '🥈';
    } else if (place === 3) {
      return '🥉';
    } else if (place <= 18) {
      return '🔞';
    } else if (place <= 100) {
      return '💯';
    } else if (positionPercentage <= 1) {
      return '1%';
    } else if (positionPercentage <= 5) {
      return '5%';
    } else if (positionPercentage <= 10) {
      return '10%';
    } else {
      return undefined;
    }
  }

  /**
   *
   * @param squadTourInfo
   * @returns
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
}

/**
 *
 */
export class SquadCacheService extends SquadService {
  private static _options?: FieldFunctionOptions;
  /**
   *
   */
  static initialize(options?: FieldFunctionOptions) {
    this._options = options;
  }
  /**
   *
   */
  static get options(): FieldFunctionOptions {
    if (!this._options) throw new Error('PlayerCacheService not initialized');
    return this._options;
  }

  /**
   *
   * @param
   * @returns
   */
  static getSeasonScoreInfo(
    squad: LeagueSquad['squad']
  ): LeagueSquad['squad']['seasonScoreInfo'] {
    if (this.options.isReference(squad)) {
      return this.options.readField<LeagueSquad['squad']['seasonScoreInfo']>(
        'seasonScoreInfo',
        squad
      );
    }
    return super.getSeasonScoreInfo(squad);
  }
  /**
   *
   * @param
   * @returns
   */
  static getCurrentTourInfo(
    squad: LeagueSquadWithCurrentTourInfo['squad'] | Reference
  ): LeagueSquadWithCurrentTourInfo['squad']['currentTourInfo'] {
    if (this.options.isReference(squad)) {
      return this.options.readField<
        LeagueSquadWithCurrentTourInfo['squad']['currentTourInfo']
      >('currentTourInfo', squad);
    }
    return super.getCurrentTourInfo(squad);
  }

  /**
   *
   * @param leagueSquads
   */
  static recalculateSquadsLiveScore(
    leagueSquads: LeagueSquadWithCurrentTourInfo[]
  ): void {
    if (!leagueSquads.length) {
      return;
    }

    this.restoreSquadsAfterTourScore(leagueSquads);
    this.recalculateSquadsTourLiveScore(leagueSquads);
    this.recalculateSquadsAfterTourScore(leagueSquads);
  }

  /**
   *
   * @param leagueSquads
   */
  static restoreSquadsAfterTourScore(
    leagueSquads: LeagueSquadWithCurrentTourInfo[]
  ): void {
    for (const leagueSquad of leagueSquads) {
      const seasonScoreInfo = this.getSeasonScoreInfo(leagueSquad.squad);
      leagueSquad.scoreInfo.pointsAfterTour = seasonScoreInfo?.score
        ? seasonScoreInfo?.score - leagueSquad.scoreInfo.score
        : 0;
    }

    leagueSquads = leagueSquads.sort(
      (a, b) => b.scoreInfo.pointsAfterTour - a.scoreInfo.pointsAfterTour
    );
    let place = 0,
      pointsPrev = 0;
    for (const leagueSquad of leagueSquads) {
      if (leagueSquad.scoreInfo.pointsAfterTour !== pointsPrev || !place) {
        place++;
      }
      leagueSquad.scoreInfo.placeAfterTour = place;
      pointsPrev = leagueSquad.scoreInfo.pointsAfterTour;
    }
  }

  /**
   *
   * @param leagueSquads
   */
  static recalculateSquadsTourLiveScore(
    leagueSquads: LeagueSquadWithCurrentTourInfo[]
  ): void {
    let scoreSum = 0;
    for (const leagueSquad of leagueSquads) {
      const currentTourInfo = this.getCurrentTourInfo(leagueSquad.squad);
      leagueSquad.scoreInfo.score = PlayerService.filterPlayersWithPointsCount(
        currentTourInfo?.players || []
      ).reduce((sum, p) => sum + (p.points || 0), 0);
      // Sum for average
      scoreSum += leagueSquad.scoreInfo.score;
    }
    const averageScore = scoreSum / leagueSquads.length;

    leagueSquads = leagueSquads.sort(
      (a, b) => b.scoreInfo.score - a.scoreInfo.score
    );
    let place = 0,
      scorePrev = 0;
    for (const leagueSquad of leagueSquads) {
      // average
      leagueSquad.scoreInfo.averageScore = Number(averageScore.toFixed(1));

      // place
      if (leagueSquad.scoreInfo.score !== scorePrev || !place) {
        place++;
      }
      leagueSquad.scoreInfo.place = place;
      scorePrev = leagueSquad.scoreInfo.place;
    }
  }

  /**
   *
   * @param leagueSquads
   */
  static recalculateSquadsAfterTourScore(
    leagueSquads: LeagueSquadWithCurrentTourInfo[]
  ): void {
    for (const leagueSquad of leagueSquads) {
      leagueSquad.scoreInfo.pointsAfterTour += leagueSquad.scoreInfo.score;
    }

    leagueSquads = leagueSquads.sort(
      (a, b) => b.scoreInfo.pointsAfterTour - a.scoreInfo.pointsAfterTour
    );
    let place = 0,
      pointsPrev = 0;
    for (const leagueSquad of leagueSquads) {
      if (leagueSquad.scoreInfo.pointsAfterTour !== pointsPrev || !place) {
        place++;
      }
      leagueSquad.scoreInfo.placeAfterTourDiff =
        leagueSquad.scoreInfo.placeAfterTour - place;
      leagueSquad.scoreInfo.placeAfterTour = place;
      pointsPrev = leagueSquad.scoreInfo.pointsAfterTour;
    }
  }
}
