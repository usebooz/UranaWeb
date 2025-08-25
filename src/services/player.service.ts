import type { SquadTourPlayer } from '@/gql';
import { FantasyPlayerRole } from '@/gql/generated/graphql';

export class PlayerService {
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
  static recalculateViceCaptain(players: SquadTourPlayer[]): void {
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
  static recalculateGoalkeeperLiveScore(players: SquadTourPlayer[]): void {
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
  static recalculateFieldPlayersLiveScore(players: SquadTourPlayer[]): void {
    const fieldPlayersOnBench = this.getSquadTourFieldPlayersOnBench(players);
    for (const substitutePlayer of fieldPlayersOnBench) {
      if (!this.isSquadTourPlayerPointsCount(substitutePlayer)) {
        substitutePlayer.points = 0;
        continue;
      }
      substitutePlayer.isPointsCount = false;
    }
  }
}
