import type { SquadTourPlayer } from '@/gql';
import {
  FantasyPlayerRole,
  FantasyPlayerStatus,
} from '@/gql/generated/graphql';
import { FieldFunctionOptions } from '@apollo/client';

/**
 *
 */
export class PlayerService {
  /**
   *
   * @param
   * @returns
   */
  static getRole(player: SquadTourPlayer): FantasyPlayerRole | undefined {
    return player.seasonPlayer.role;
  }
  /**
   *
   * @param
   * @returns
   */
  static getStatus(player: SquadTourPlayer) {
    return player.seasonPlayer.status;
  }
  /**
   *
   * @param
   * @returns
   */
  static getTeam(player: SquadTourPlayer) {
    return player.seasonPlayer.team;
  }

  /**
   *
   * @param
   * @returns
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
   *
   * @param
   * @returns
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
   * @param player
   * @returns
   */
  static isGoalkeeper(player: SquadTourPlayer): boolean {
    return this.getRole(player) === FantasyPlayerRole.Goalkeeper;
  }

  /**
   *
   * @param player
   * @returns
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
   *
   * @param player
   * @returns
   */
  static isTeamPlayed(player: SquadTourPlayer): boolean {
    return player.playedMatchesTour > 0;
  }

  /**
   *
   * @param player
   * @returns
   */
  static isNotPlayedInClosedMatch(player: SquadTourPlayer): boolean {
    return this.isTeamPlayed(player) && !this.isPointsCount(player);
  }

  /**
   *
   * @param player
   * @returns
   */
  static isFieldPlayer(player: SquadTourPlayer): boolean {
    return this.getRole(player) !== FantasyPlayerRole.Goalkeeper;
  }

  /**
   *
   * @param player
   * @returns
   */
  static isStartPlayer(player: SquadTourPlayer): boolean {
    return player.isStarting;
  }

  /**
   *
   * @param players
   * @returns
   */
  static filterPlayersOnBench(players: SquadTourPlayer[]): SquadTourPlayer[] {
    return players
      .filter(p => !this.isStartPlayer(p))
      .sort(
        (a, b) => (a.substitutePriority || 0) - (b.substitutePriority || 0)
      );
  }

  /**
   *
   * @param players
   * @returns
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
   *
   * @param players
   * @returns
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
   *
   * @param players
   * @returns
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
   *
   * @param players
   * @returns
   */
  static filterPlayersWithPointsCount(
    players: SquadTourPlayer[]
  ): SquadTourPlayer[] {
    return players.filter(p => this.isPointsCount(p));
  }

  /**
   *
   * @param players
   * @returns
   */
  static findGoalkeeperOnBench(
    players: SquadTourPlayer[]
  ): SquadTourPlayer | undefined {
    return players.find(p => !this.isFieldPlayer(p) && !this.isStartPlayer(p));
  }

  /**
   *
   * @param players
   * @returns
   */
  static findGoalkeeperInStarting(
    players: SquadTourPlayer[]
  ): SquadTourPlayer | undefined {
    return players.find(p => !this.isFieldPlayer(p) && this.isStartPlayer(p));
  }

  /**
   *
   * @param players
   * @returns
   */
  static findViceCaptain(
    players: SquadTourPlayer[]
  ): SquadTourPlayer | undefined {
    return players.find(p => p.isViceCaptain);
  }

  /**
   *
   * @param players
   * @returns
   */
  static findCaptain(players: SquadTourPlayer[]): SquadTourPlayer | undefined {
    return players.find(p => p.isCaptain);
  }
}

/**
 *
 */
export class PlayerCacheService extends PlayerService {
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
   *
   * @param
   * @returns
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
   *
   * @param
   * @returns
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
   *
   * @param
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
   *
   * @param players
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
   *
   * @param players
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
   *
   * @param players
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
