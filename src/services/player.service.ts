import type { SquadTourPlayer } from '@/gql';
import {
  FantasyPlayerRole,
  FantasyPlayerStatus,
} from '@/gql/generated/graphql';
import { FieldFunctionOptions } from '@apollo/client';

/**
 * Service class for handling player-related operations and data transformations.
 * Provides utilities for getting player information, emojis, and status checks.
 */
export class PlayerService {
  /**
   * Gets the fantasy role of a player.
   *
   * @param player - The squad tour player
   * @returns The player's fantasy role or undefined if not available
   */
  static getRole(player: SquadTourPlayer): FantasyPlayerRole | undefined {
    return player.seasonPlayer.role;
  }

  /**
   * Gets the current status of a player.
   *
   * @param player - The squad tour player
   * @returns The player's current status
   */
  static getStatus(player: SquadTourPlayer) {
    return player.seasonPlayer.status;
  }

  /**
   * Gets the team information for a player.
   *
   * @param player - The squad tour player
   * @returns The player's team information
   */
  static getTeam(player: SquadTourPlayer) {
    return player.seasonPlayer.team;
  }

  /**
   * Gets the emoji representation for a player's role.
   *
   * @param player - The squad tour player
   * @returns Emoji string representing the role or undefined if role is not recognized
   */
  static getRoleEmoji(player: SquadTourPlayer): string | undefined {
    switch (this.getRole(player)) {
      case FantasyPlayerRole.Goalkeeper:
        return '🧤';
      case FantasyPlayerRole.Defender:
        return '🛡️';
      case FantasyPlayerRole.Midfielder:
        return '🔗';
      case FantasyPlayerRole.Forward:
        return '🎯';
      default:
        return undefined;
    }
  }

  /**
   * Gets the emoji representation for a player's status.
   *
   * @param player - The squad tour player
   * @returns Emoji string representing the status or undefined for normal status
   */
  static getStatusEmoji(player: SquadTourPlayer): string | undefined {
    switch (this.getStatus(player)?.status) {
      case FantasyPlayerStatus.Injury:
        return '💔';
      case FantasyPlayerStatus.Fiery:
        return '🔥';
      case FantasyPlayerStatus.Disqualification:
        return '🟥';
      default:
        if (!this.getTeam(player)) return '🪦';
        return undefined;
    }
  }

  /**
   * Gets the captain emoji based on player's captain status.
   *
   * @param player - The squad tour player
   * @returns Captain emoji: gold for captain, silver for vice-captain, undefined for regular player
   */
  static getCaptainEmoji(player: SquadTourPlayer): string | undefined {
    if (player.isCaptain) {
      return '🥇';
    } else if (player.isViceCaptain) {
      return '🥈';
    } else {
      return undefined;
    }
  }

  /**
   * Checks if a player is a goalkeeper.
   *
   * @param player - The squad tour player to check
   * @returns True if the player is a goalkeeper, false otherwise
   */
  static isGoalkeeper(player: SquadTourPlayer): boolean {
    return this.getRole(player) === FantasyPlayerRole.Goalkeeper;
  }

  /**
   * Checks if a player's points are definitely counting towards the score.
   *
   * @param player - The squad tour player to check
   * @returns True if player's points are confirmed to count
   */
  static isPointsCount(player: SquadTourPlayer): boolean {
    return player.isPointsCount;
  }

  /**
   * Checks if a player's points may count (match not finished yet).
   *
   * @param player - The squad tour player to check
   * @returns True if player's points might count but are not yet confirmed
   */
  static isPointsMayCount(player: SquadTourPlayer): boolean {
    return !player.isPointsCount && player.points !== player.score;
  }

  /**
   * Checks if a player's points will not count towards the final score.
   *
   * @param player - The squad tour player to check
   * @returns True if player's points are confirmed not to count
   */
  static isPointsNotCount(player: SquadTourPlayer): boolean {
    return !(this.isPointsCount(player) || this.isPointsMayCount(player));
  }

  /**
   * Checks if a player's team has played any matches in the current tour.
   *
   * @param player - The squad tour player to check
   * @returns True if the player's team has played at least one match
   */
  static isTeamPlayed(player: SquadTourPlayer): boolean {
    return player.playedMatchesTour > 0;
  }

  /**
   * Checks if a player didn't play in a closed match (team played but player didn't get points).
   *
   * @param player - The squad tour player to check
   * @returns True if team played but player's points don't count
   */
  static isNotPlayedInClosedMatch(player: SquadTourPlayer): boolean {
    return this.isTeamPlayed(player) && !this.isPointsCount(player);
  }

  /**
   * Checks if a player is a field player (not a goalkeeper).
   *
   * @param player - The squad tour player to check
   * @returns True if the player is not a goalkeeper
   */
  static isFieldPlayer(player: SquadTourPlayer): boolean {
    return this.getRole(player) !== FantasyPlayerRole.Goalkeeper;
  }

  /**
   * Checks if a player is in the starting lineup.
   *
   * @param player - The squad tour player to check
   * @returns True if the player is starting
   */
  static isStartPlayer(player: SquadTourPlayer): boolean {
    return player.isStarting;
  }

  /**
   * Filters and sorts players who are on the bench (not starting).
   *
   * @param players - Array of squad tour players
   * @returns Array of bench players sorted by substitute priority
   */
  static filterPlayersOnBench(players: SquadTourPlayer[]): SquadTourPlayer[] {
    return players
      .filter(p => !this.isStartPlayer(p))
      .sort(
        (a, b) => (a.substitutePriority || 0) - (b.substitutePriority || 0)
      );
  }

  /**
   * Filters field players (non-goalkeepers) who are on the bench.
   *
   * @param players - Array of squad tour players
   * @returns Array of field players on the bench sorted by substitute priority
   */
  static filterFieldPlayersOnBench(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return this.filterPlayersOnBench(players).filter(p =>
      this.isFieldPlayer(p)
    );
  }

  /**
   * Filters starting players by their fantasy role.
   *
   * @param players - Array of squad tour players
   * @param role - Fantasy player role to filter by
   * @returns Array of starting players with the specified role
   */
  static filterStartPlayersByRole(
    players: SquadTourPlayer[],
    role: FantasyPlayerRole
  ): SquadTourPlayer[] {
    return players.filter(
      p => this.isStartPlayer(p) && p.seasonPlayer.role === role
    );
  }

  /**
   * Gets the formation breakdown of starting players by role.
   *
   * @param players - Array of squad tour players
   * @returns Object with role names as keys and player counts as values
   */
  static getStartPlayersFormation(
    players: SquadTourPlayer[]
  ): Record<string, number> {
    const formation: Record<string, number> = {};

    players
      .filter(p => this.isStartPlayer(p))
      .forEach(p => {
        const role = p.seasonPlayer.role;
        formation[role] = (formation[role] || 0) + 1;
      });

    return formation;
  }

  /**
   * Filters starting field players who didn't play in closed matches.
   *
   * @param players - Array of squad tour players
   * @returns Array of starting field players who didn't get points in closed matches
   */
  static filterStartFieldPlayersNotPlayed(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players.filter(
      p =>
        this.isStartPlayer(p) &&
        this.isFieldPlayer(p) &&
        this.isNotPlayedInClosedMatch(p)
    );
  }

  /**
   * Filters players whose points are confirmed to count towards the final score.
   *
   * @param players - Array of squad tour players
   * @returns Array of players whose points count
   */
  static filterPlayersWithPointsCount(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players.filter(p => this.isPointsCount(p));
  }

  /**
   * Finds the goalkeeper who is on the bench (not starting).
   *
   * @param players - Array of squad tour players
   * @returns Goalkeeper on bench or undefined if not found
   */
  static findGoalkeeperOnBench(
    players: SquadTourPlayer[]
  ): SquadTourPlayer | undefined {
    return players.find(p => !this.isFieldPlayer(p) && !this.isStartPlayer(p));
  }

  /**
   * Finds the goalkeeper who is in the starting lineup.
   *
   * @param players - Array of squad tour players
   * @returns Starting goalkeeper or undefined if not found
   */
  static findGoalkeeperInStarting(
    players: SquadTourPlayer[]
  ): SquadTourPlayer | undefined {
    return players.find(p => !this.isFieldPlayer(p) && this.isStartPlayer(p));
  }

  /**
   * Finds the vice-captain player in the squad.
   *
   * @param players - Array of squad tour players
   * @returns Vice-captain player or undefined if not found
   */
  static findViceCaptain(
    players: SquadTourPlayer[]
  ): SquadTourPlayer | undefined {
    return players.find(p => p.isViceCaptain);
  }

  /**
   * Finds the captain player in the squad.
   *
   * @param players - Array of squad tour players
   * @returns Captain player or undefined if not found
   */
  static findCaptain(players: SquadTourPlayer[]): SquadTourPlayer | undefined {
    return players.find(p => p.isCaptain);
  }
}

/**
 * Extended player service that works with Apollo Client cache.
 * Provides cache-aware methods for reading player data from GraphQL cache.
 */
export class PlayerCacheService extends PlayerService {
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
   * Gets player role with cache awareness for Apollo Client references.
   *
   * @param player - The squad tour player (may be a cache reference)
   * @returns Player's fantasy role or undefined
   */
  static getRole(player: SquadTourPlayer) {
    if (this.options.isReference(player.seasonPlayer)) {
      return this.options.readField<FantasyPlayerRole>(
        'role',
        player.seasonPlayer
      );
    }
    return super.getRole(player);
  }
  /**
   * Gets player status with cache awareness for Apollo Client references.
   *
   * @param player - The squad tour player (may be a cache reference)
   * @returns Player's current status
   */
  static getStatus(player: SquadTourPlayer) {
    if (this.options.isReference(player.seasonPlayer)) {
      return this.options.readField<SquadTourPlayer['seasonPlayer']['status']>(
        'status',
        player.seasonPlayer
      );
    }
    return super.getStatus(player);
  }
  /**
   * Gets player team with cache awareness for Apollo Client references.
   *
   * @param player - The squad tour player (may be a cache reference)
   * @returns Player's team information
   */
  static getTeam(player: SquadTourPlayer) {
    if (this.options.isReference(player.seasonPlayer)) {
      return this.options.readField<SquadTourPlayer['seasonPlayer']['team']>(
        'team',
        player.seasonPlayer
      );
    }
    return super.getTeam(player);
  }

  /**
   * Recalculates live scores for all players in a squad during active tour.
   * Handles field players, goalkeeper substitutions, and vice-captain logic.
   *
   * @param players - Array of squad tour players to recalculate
   */
  static recalculateSquadPlayersLiveScore(players: SquadTourPlayer[]): void {
    if (!players?.length) {
      return;
    }

    this.recalculateFieldPlayersLiveScore(players);
    this.recalculateGoalkeeperLiveScore(players);
    this.recalculateViceCaptain(players);
  }
  /**
   * Recalculates vice-captain scoring when captain doesn't play.
   * Vice-captain gets captain's multiplier if captain didn't get points.
   *
   * @param players - Array of squad tour players
   */
  static recalculateViceCaptain(players: SquadTourPlayer[]): void {
    const viceCaptain = this.findViceCaptain(players);
    const captain = this.findCaptain(players);
    if (!viceCaptain || !captain) {
      return;
    }
    if (
      !this.isPointsCount(viceCaptain) ||
      this.isNotPlayedInClosedMatch(captain)
    ) {
      return;
    }
    viceCaptain.points = viceCaptain.score =
      viceCaptain.statPlayer?.points || 0;
  }
  /**
   * Recalculates goalkeeper scoring with substitution logic.
   * Bench goalkeeper gets points if starting goalkeeper doesn't play.
   *
   * @param players - Array of squad tour players
   */
  static recalculateGoalkeeperLiveScore(players: SquadTourPlayer[]): void {
    const goalkeeperInStarting = this.findGoalkeeperInStarting(players);
    const goalkeeperOnBench = this.findGoalkeeperOnBench(players);
    if (!goalkeeperOnBench || !goalkeeperInStarting) {
      return;
    }
    if (
      !this.isPointsCount(goalkeeperOnBench) ||
      this.isNotPlayedInClosedMatch(goalkeeperInStarting)
    ) {
      return;
    }
    goalkeeperOnBench.points = 0;
    goalkeeperOnBench.isPointsCount = false;
  }
  /**
   * Recalculates field players' live scores, removing points from bench players.
   * Bench field players don't get points in live scoring calculations.
   *
   * @param players - Array of squad tour players
   */
  static recalculateFieldPlayersLiveScore(players: SquadTourPlayer[]): void {
    const fieldPlayersOnBench = this.filterFieldPlayersOnBench(players);
    for (const substitutePlayer of fieldPlayersOnBench) {
      if (!this.isPointsCount(substitutePlayer)) {
        continue;
      }
      substitutePlayer.points = 0;
      substitutePlayer.isPointsCount = false;
    }
  }
}
