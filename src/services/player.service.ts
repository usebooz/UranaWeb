import type { SquadTourPlayer } from '@/gql';
import {
  FantasyPlayerRole,
  FantasyPlayerStatus,
} from '@/gql/generated/graphql';

/**
 * Service for individual player operations and statistics
 */
export class PlayerService {
  /**
   *
   * @param
   * @returns
   */
  static getRoleEmoji(player: SquadTourPlayer): string {
    switch (player.seasonPlayer.role) {
      case FantasyPlayerRole.Goalkeeper:
        return '🧤';
      case FantasyPlayerRole.Defender:
        return '🛡️';
      case FantasyPlayerRole.Midfielder:
        return '🔗';
      case FantasyPlayerRole.Forward:
        return '🎯';
    }
  }

  /**
   *
   * @param
   * @returns
   */
  static getStatusEmoji(player: SquadTourPlayer): string | undefined {
    switch (player.seasonPlayer.status?.status) {
      case FantasyPlayerStatus.Injury:
        return '💔';
      case FantasyPlayerStatus.Fiery:
        return '🔥';
      case FantasyPlayerStatus.Disqualification:
        return '🟥';
      default:
        if (!player.seasonPlayer.team) return '🪦';
        return undefined;
    }
  }

  /**
   *
   * @param
   * @returns
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
   *
   * @param player - squad tour player data
   * @returns
   */
  static isGoalkeeper(player: SquadTourPlayer): boolean {
    return player.seasonPlayer.role === FantasyPlayerRole.Goalkeeper;
  }

  /**
   * Checks if player points count towards squad score
   * @param player - squad tour player data
   * @returns true if player points are counted
   */
  static isPointsCount(player: SquadTourPlayer): boolean {
    return player.isPointsCount;
  }

  /**
   *
   * @param player
   * @returns
   */
  static isPointsMayCount(player: SquadTourPlayer): boolean {
    return !player.isPointsCount && player.points !== player.score;
  }

  /**
   *
   * @param player
   * @returns
   */
  static isPointsNotCount(player: SquadTourPlayer): boolean {
    return !(this.isPointsCount(player) || this.isPointsMayCount(player));
  }

  /**
   * Checks if player's team played in tour
   * @param player - squad tour player data
   * @returns true if team played any matches in tour
   */
  static isTeamPlayed(player: SquadTourPlayer): boolean {
    return player.playedMatchesTour > 0;
  }

  /**
   * Checks if player didn't play in match despite team playing
   * @param player - squad tour player data
   * @returns true if team played but player didn't get points
   */
  static isNotPlayedInMatch(player: SquadTourPlayer): boolean {
    return this.isTeamPlayed(player) && !this.isPointsCount(player);
  }

  /**
   * Checks if player is a field player (not goalkeeper)
   * @param player - squad tour player data
   * @returns true if player is not a goalkeeper
   */
  static isFieldPlayer(player: SquadTourPlayer): boolean {
    return player.seasonPlayer.role !== FantasyPlayerRole.Goalkeeper;
  }

  /**
   * Checks if player is in starting lineup
   * @param player - squad tour player data
   * @returns true if player is starting
   */
  static isStartPlayer(player: SquadTourPlayer): boolean {
    return player.isStarting;
  }

  /**
   * Filters players currently on bench sorted by substitute priority
   * @param players - array of squad tour players
   * @returns sorted array of players on bench
   */
  static filterPlayersOnBench(players: SquadTourPlayer[]): SquadTourPlayer[] {
    return players
      .filter(p => !this.isStartPlayer(p))
      .sort(
        (a, b) => (a.substitutePriority || 0) - (b.substitutePriority || 0)
      );
  }

  /**
   * Filters field players currently on bench sorted by substitute priority
   * @param players - array of squad tour players
   * @returns sorted array of field players on bench
   */
  static filterFieldPlayersOnBench(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return this.filterPlayersOnBench(players).filter(p =>
      this.isFieldPlayer(p)
    );
  }

  /**
   *
   * @param players
   * @param role
   * @returns
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
   * Gets formation map of starting players by their roles
   * @param players - array of squad tour players
   * @returns object with role counts
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
   * Filters starting field players who didn't play in matches
   * @param players - array of squad tour players
   * @returns array of starting field players who didn't play
   */
  static filterStartFieldPlayersNotPlayed(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players.filter(
      p =>
        this.isStartPlayer(p) &&
        this.isFieldPlayer(p) &&
        this.isNotPlayedInMatch(p)
    );
  }

  /**
   * Filters players whose points count towards squad score
   * @param players - array of squad tour players
   * @returns array of players with counted points
   */
  static filterPlayersWithPointsCount(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players.filter(p => this.isPointsCount(p));
  }

  /**
   * Recalculates vice captain points if captain didn't play
   * @param players - array of squad tour players
   */
  static recalculateViceCaptain(players: SquadTourPlayer[]): void {
    const viceCaptain = players.find(p => p.isViceCaptain);
    const captain = players.find(p => p.isCaptain);
    if (!viceCaptain || !captain) return;
    if (!this.isPointsCount(viceCaptain) || this.isNotPlayedInMatch(captain))
      return;

    viceCaptain.points = viceCaptain.score =
      viceCaptain.statPlayer?.points || 0;
  }

  /**
   * Recalculates goalkeeper live score with substitution logic
   * @param players - array of squad tour players
   */
  static recalculateGoalkeeperLiveScore(players: SquadTourPlayer[]): void {
    const goalkeeperOnBench = players.find(
      p => !this.isFieldPlayer(p) && !this.isStartPlayer(p)
    );
    if (!goalkeeperOnBench) return;
    if (!this.isPointsCount(goalkeeperOnBench)) {
      goalkeeperOnBench.points = 0;
      return;
    }

    const goalkeeperInStarting = players.find(
      p => !this.isFieldPlayer(p) && this.isStartPlayer(p)
    );
    if (!goalkeeperInStarting || this.isNotPlayedInMatch(goalkeeperInStarting))
      return;

    goalkeeperOnBench.isPointsCount = false;
  }

  /**
   * Recalculates field players live score with substitution logic
   * @param players - array of squad tour players
   */
  static recalculateFieldPlayersLiveScore(players: SquadTourPlayer[]): void {
    const fieldPlayersOnBench = this.filterFieldPlayersOnBench(players);
    for (const substitutePlayer of fieldPlayersOnBench) {
      if (!this.isPointsCount(substitutePlayer)) {
        substitutePlayer.points = 0;
        continue;
      }
      substitutePlayer.isPointsCount = false;
    }
  }
}
