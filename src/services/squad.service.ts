import type {
  LeagueSquad,
  LeagueSquadWithCurrentTourInfo,
  SquadTourInfo,
} from '@/gql';
import { FieldFunctionOptions, Reference } from '@apollo/client';
import { PlayerService } from './player.service';

/**
 * Service for team/squad scoring and statistics operations.
 * Handles squad data extraction, scoring calculations, and formatting for league management.
 */
export class SquadService {
  /**
   * Gets the season score information from a squad.
   *
   * @param squad - The squad data
   * @returns Season score information
   */
  static getSeasonScoreInfo(
    squad: LeagueSquad['squad']
  ): LeagueSquad['squad']['seasonScoreInfo'] {
    return squad.seasonScoreInfo;
  }

  /**
   * Gets the current tour information from a squad with tour info.
   *
   * @param squad - The squad data with current tour info
   * @returns Current tour information
   */
  static getCurrentTourInfo(
    squad: LeagueSquadWithCurrentTourInfo['squad']
  ): LeagueSquadWithCurrentTourInfo['squad']['currentTourInfo'] {
    return squad.currentTourInfo;
  }

  /**
   * Finds the winner (1st place) squad from league squads.
   *
   * @param leagueSquads - Array of league squads
   * @returns The squad in 1st place or undefined if none found
   */
  static findTourWinner(leagueSquads?: LeagueSquad[]): LeagueSquad | undefined {
    return leagueSquads?.find(leagueSquad => leagueSquad.scoreInfo.place === 1);
  }

  /**
   * Formats the tour average score from the first squad in the league.
   * All squads in a league should have the same average score.
   *
   * @param leagueSquads - Array of league squads
   * @returns Formatted average score string or undefined if no squads
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
   * Formats the average score for a single squad with ∅ symbol.
   *
   * @param leagueSquad - The league squad data
   * @returns Formatted average score string (e.g., "∅42")
   */
  static formatAverageScore(leagueSquad: LeagueSquad): string {
    return `∅${leagueSquad.scoreInfo.averageScore?.toString() ?? '0'}`;
  }

  /**
   * Gets the total count of squads in the league.
   *
   * @param leagueSquads - Array of league squads
   * @returns Total squads count as string or undefined if no squads
   */
  static getSquadsCount(leagueSquads?: LeagueSquad[]): string | undefined {
    const firstSquad = leagueSquads?.[0];
    const squadsCount = firstSquad?.scoreInfo?.totalPlaces ?? 0;
    return squadsCount.toString();
  }

  /**
   * Checks if a squad's place difference after tour is negative (dropped in ranking).
   *
   * @param leagueSquad - The league squad data
   * @returns True if the squad dropped in ranking
   */
  static isPlaceDiffNegative(leagueSquad: LeagueSquad): boolean {
    return leagueSquad.scoreInfo.placeAfterTourDiff < 0;
  }

  /**
   * Formats the place difference with directional arrows.
   *
   * @param leagueSquad - The league squad data
   * @returns Formatted place difference (e.g., "3↑" or "2↓") or undefined if no change
   */
  static formatPlaceDiff(leagueSquad: LeagueSquad): string | undefined {
    if (!leagueSquad.scoreInfo.placeAfterTourDiff) return undefined;
    return this.isPlaceDiffNegative(leagueSquad)
      ? `${leagueSquad.scoreInfo.placeAfterTourDiff.toString().replace('-', '')}↓`
      : `${leagueSquad.scoreInfo.placeAfterTourDiff.toString()}↑`;
  }

  /**
   * Formats squad's top ranking position with appropriate emoji or percentage.
   * Returns medals for top 3, special emoji for top 18/100, or percentage for top performers.
   *
   * @param squad - The league squad data
   * @returns Formatted top position string or undefined if not in top rankings
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
   * Formats the total number of transfers available for a squad.
   * Shows infinity symbol for unlimited transfers or total count.
   *
   * @param squadTourInfo - Squad tour information containing transfer data
   * @returns Formatted transfer count string or undefined
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
 * Extended squad service that works with Apollo Client cache.
 * Provides cache-aware methods for reading squad data and live score calculations.
 */
export class SquadCacheService extends SquadService {
  private static _options?: FieldFunctionOptions;
  /**
   * Initializes the cache service with Apollo Client field function options.
   *
   * @param options - Apollo Client field function options for cache operations
   */
  static initialize(options?: FieldFunctionOptions) {
    this._options = options;
  }
  /**
   * Gets the initialized Apollo Client field function options.
   *
   * @returns Field function options for cache operations
   * @throws Error if service not initialized
   */
  static get options(): FieldFunctionOptions {
    if (!this._options) throw new Error('PlayerCacheService not initialized');
    return this._options;
  }

  /**
   * Gets season score info with cache awareness for Apollo Client references.
   *
   * @param squad - The squad data (may be a cache reference)
   * @returns Season score information
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
   * Gets current tour info with cache awareness for Apollo Client references.
   *
   * @param squad - The squad data (may be a cache reference)
   * @returns Current tour information
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
   * Recalculates live scores for all squads in a league during active tour.
   * Handles tour scores, rankings, and after-tour projections.
   *
   * @param leagueSquads - Array of league squads to recalculate
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
   * Restores squad scores to their state after the previous tour.
   * Calculates points after tour and rankings before current tour scoring.
   *
   * @param leagueSquads - Array of league squads to restore
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
   * Recalculates current tour live scores and rankings for all squads.
   * Updates tour scores, average scores, and current tour rankings.
   *
   * @param leagueSquads - Array of league squads to recalculate
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
   * Recalculates final after-tour scores and rankings including current tour points.
   * Updates place differences and final standings after tour completion.
   *
   * @param leagueSquads - Array of league squads to recalculate
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
