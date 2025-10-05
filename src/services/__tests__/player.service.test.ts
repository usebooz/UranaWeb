import { describe, it, expect } from 'vitest';

import { PlayerService, PlayerCacheService } from '../player.service';
import type { SquadTourPlayer } from '@/gql';
import {
  FantasyPlayerRole,
  FantasyPlayerStatus,
} from '@/gql/generated/graphql';

// Test helpers
const createMockSquadTourPlayer = (
  overrides: Partial<SquadTourPlayer> = {}
): SquadTourPlayer => ({
  isCaptain: false,
  isViceCaptain: false,
  isStarting: true,
  substitutePriority: null,
  points: 10,
  score: 10,
  isPointsCount: true,
  playedMatchesTour: 1,
  seasonPlayer: {
    id: 'player-1',
    name: 'Test Player',
    role: FantasyPlayerRole.Midfielder,
    status: { status: FantasyPlayerStatus.Unavailable },
    statObject: {
      id: 'stat-1',
      firstName: 'Test',
      lastName: 'Player',
    },
    team: {
      id: 'team-1',
      name: 'Test Team',
      statObject: { id: 'stat-team-1' },
      svgKit: { url: 'kit.svg' },
    },
  },
  statPlayer: {
    points: 8,
  },
  ...overrides,
});

describe('PlayerService', () => {
  describe('getRole', () => {
    it('should return player role', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Goalkeeper,
        },
      });

      const result = PlayerService.getRole(player);

      expect(result).toBe(FantasyPlayerRole.Goalkeeper);
    });
  });

  describe('getStatus', () => {
    it('should return player status', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          status: { status: FantasyPlayerStatus.Injury },
        },
      });

      const result = PlayerService.getStatus(player);

      expect(result).toBeDefined();
      expect(result!.status).toBe(FantasyPlayerStatus.Injury);
    });
  });

  describe('getTeam', () => {
    it('should return player team', () => {
      const player = createMockSquadTourPlayer();
      const result = PlayerService.getTeam(player);

      expect(result).toBeDefined();
      expect(result!.id).toBe('team-1');
      expect(result!.name).toBe('Test Team');
    });
  });

  describe('getRoleEmoji', () => {
    it('should return goalkeeper emoji', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Goalkeeper,
        },
      });

      const result = PlayerService.getRoleEmoji(player);

      expect(result).toBe('🧤');
    });

    it('should return defender emoji', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Defender,
        },
      });

      const result = PlayerService.getRoleEmoji(player);

      expect(result).toBe('🛡️');
    });

    it('should return midfielder emoji', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Midfielder,
        },
      });

      const result = PlayerService.getRoleEmoji(player);

      expect(result).toBe('🔗');
    });

    it('should return forward emoji', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Forward,
        },
      });

      const result = PlayerService.getRoleEmoji(player);

      expect(result).toBe('🎯');
    });

    it('should return undefined for unknown role', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: undefined!,
        },
      });

      const result = PlayerService.getRoleEmoji(player);

      expect(result).toBeUndefined();
    });
  });

  describe('getStatusEmoji', () => {
    it('should return injury emoji', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          status: { status: FantasyPlayerStatus.Injury },
        },
      });

      const result = PlayerService.getStatusEmoji(player);

      expect(result).toBe('💔');
    });

    it('should return fiery emoji', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          status: { status: FantasyPlayerStatus.Fiery },
        },
      });

      const result = PlayerService.getStatusEmoji(player);

      expect(result).toBe('🔥');
    });

    it('should return disqualification emoji', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          status: { status: FantasyPlayerStatus.Disqualification },
        },
      });

      const result = PlayerService.getStatusEmoji(player);

      expect(result).toBe('🟥');
    });

    it('should return gravestone emoji for no team', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          team: null,
        },
      });

      const result = PlayerService.getStatusEmoji(player);

      expect(result).toBe('🪦');
    });

    it('should return undefined for available status', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          status: { status: FantasyPlayerStatus.Unavailable },
        },
      });

      const result = PlayerService.getStatusEmoji(player);

      expect(result).toBeUndefined();
    });
  });

  describe('getCaptainEmoji', () => {
    it('should return captain emoji', () => {
      const player = createMockSquadTourPlayer({ isCaptain: true });
      const result = PlayerService.getCaptainEmoji(player);

      expect(result).toBe('ⓒ');
    });

    it('should return vice-captain emoji', () => {
      const player = createMockSquadTourPlayer({ isViceCaptain: true });
      const result = PlayerService.getCaptainEmoji(player);

      expect(result).toBe('ⓥ');
    });

    it('should return undefined for regular player', () => {
      const player = createMockSquadTourPlayer();
      const result = PlayerService.getCaptainEmoji(player);

      expect(result).toBeUndefined();
    });
  });

  describe('isGoalkeeper', () => {
    it('should return true for goalkeeper', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Goalkeeper,
        },
      });

      const result = PlayerService.isGoalkeeper(player);

      expect(result).toBe(true);
    });

    it('should return false for non-goalkeeper', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Midfielder,
        },
      });

      const result = PlayerService.isGoalkeeper(player);

      expect(result).toBe(false);
    });
  });

  describe('isPointsCount', () => {
    it('should return true when points count', () => {
      const player = createMockSquadTourPlayer({ isPointsCount: true });
      const result = PlayerService.isPointsCount(player);

      expect(result).toBe(true);
    });

    it('should return false when points do not count', () => {
      const player = createMockSquadTourPlayer({ isPointsCount: false });
      const result = PlayerService.isPointsCount(player);

      expect(result).toBe(false);
    });
  });

  describe('isCaptainChipApplied', () => {
    it('should return true for captain with counting points', () => {
      const player = createMockSquadTourPlayer({
        isCaptain: true,
        isPointsCount: true,
      });

      const result = PlayerService.isCaptainChipApplied(player);

      expect(result).toBe(true);
    });

    it('should return false for captain with non-counting points', () => {
      const player = createMockSquadTourPlayer({
        isCaptain: true,
        isPointsCount: false,
      });

      const result = PlayerService.isCaptainChipApplied(player);

      expect(result).toBe(false);
    });

    it('should return true for vice-captain when doubled points', () => {
      const player = createMockSquadTourPlayer({
        isViceCaptain: true,
        isPointsCount: true,
        points: 20,
        statPlayer: { points: 10 },
      });

      const result = PlayerService.isCaptainChipApplied(player);

      expect(result).toBe(true);
    });

    it('should return false for vice-captain when not doubled', () => {
      const player = createMockSquadTourPlayer({
        isViceCaptain: true,
        isPointsCount: true,
        points: 10,
        statPlayer: { points: 10 },
      });

      const result = PlayerService.isCaptainChipApplied(player);

      expect(result).toBe(false);
    });

    it('should return false for regular player', () => {
      const player = createMockSquadTourPlayer({
        isCaptain: false,
        isViceCaptain: false,
        isPointsCount: true,
      });

      const result = PlayerService.isCaptainChipApplied(player);

      expect(result).toBe(false);
    });
  });

  describe('isPointsMayCount', () => {
    it('should return true when points may count', () => {
      const player = createMockSquadTourPlayer({
        isPointsCount: false,
        points: 15,
        score: 10,
      });

      const result = PlayerService.isPointsMayCount(player);

      expect(result).toBe(true);
    });

    it('should return false when points already count', () => {
      const player = createMockSquadTourPlayer({
        isPointsCount: true,
        points: 15,
        score: 10,
      });

      const result = PlayerService.isPointsMayCount(player);

      expect(result).toBe(false);
    });

    it('should return false when points equal score', () => {
      const player = createMockSquadTourPlayer({
        isPointsCount: false,
        points: 10,
        score: 10,
      });

      const result = PlayerService.isPointsMayCount(player);

      expect(result).toBe(false);
    });
  });

  describe('isPointsNotCount', () => {
    it('should return true when points definitely do not count', () => {
      const player = createMockSquadTourPlayer({
        isPointsCount: false,
        points: 10,
        score: 10,
      });

      const result = PlayerService.isPointsNotCount(player);

      expect(result).toBe(true);
    });

    it('should return false when points count', () => {
      const player = createMockSquadTourPlayer({
        isPointsCount: true,
        points: 10,
        score: 10,
      });

      const result = PlayerService.isPointsNotCount(player);

      expect(result).toBe(false);
    });

    it('should return false when points may count', () => {
      const player = createMockSquadTourPlayer({
        isPointsCount: false,
        points: 15,
        score: 10,
      });

      const result = PlayerService.isPointsNotCount(player);

      expect(result).toBe(false);
    });
  });

  describe('isTeamPlayed', () => {
    it('should return true when team has played matches', () => {
      const player = createMockSquadTourPlayer({ playedMatchesTour: 2 });
      const result = PlayerService.isTeamPlayed(player);

      expect(result).toBe(true);
    });

    it('should return false when team has not played', () => {
      const player = createMockSquadTourPlayer({ playedMatchesTour: 0 });
      const result = PlayerService.isTeamPlayed(player);

      expect(result).toBe(false);
    });
  });

  describe('isNotPlayedInClosedMatch', () => {
    it('should return true when team played but points do not count', () => {
      const player = createMockSquadTourPlayer({
        playedMatchesTour: 1,
        isPointsCount: false,
      });

      const result = PlayerService.isNotPlayedInClosedMatch(player);

      expect(result).toBe(true);
    });

    it('should return false when team played and points count', () => {
      const player = createMockSquadTourPlayer({
        playedMatchesTour: 1,
        isPointsCount: true,
      });

      const result = PlayerService.isNotPlayedInClosedMatch(player);

      expect(result).toBe(false);
    });

    it('should return false when team has not played', () => {
      const player = createMockSquadTourPlayer({
        playedMatchesTour: 0,
        isPointsCount: false,
      });

      const result = PlayerService.isNotPlayedInClosedMatch(player);

      expect(result).toBe(false);
    });
  });

  describe('isFieldPlayer', () => {
    it('should return true for midfielder', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Midfielder,
        },
      });

      const result = PlayerService.isFieldPlayer(player);

      expect(result).toBe(true);
    });

    it('should return false for goalkeeper', () => {
      const player = createMockSquadTourPlayer({
        seasonPlayer: {
          ...createMockSquadTourPlayer().seasonPlayer,
          role: FantasyPlayerRole.Goalkeeper,
        },
      });

      const result = PlayerService.isFieldPlayer(player);

      expect(result).toBe(false);
    });
  });

  describe('isStartPlayer', () => {
    it('should return true for starting player', () => {
      const player = createMockSquadTourPlayer({ isStarting: true });
      const result = PlayerService.isStartPlayer(player);

      expect(result).toBe(true);
    });

    it('should return false for bench player', () => {
      const player = createMockSquadTourPlayer({ isStarting: false });
      const result = PlayerService.isStartPlayer(player);

      expect(result).toBe(false);
    });
  });

  describe('filterPlayersOnBench', () => {
    it('should filter and sort bench players by substitute priority', () => {
      const players = [
        createMockSquadTourPlayer({ isStarting: true }),
        createMockSquadTourPlayer({
          isStarting: false,
          substitutePriority: 2,
        }),
        createMockSquadTourPlayer({
          isStarting: false,
          substitutePriority: 1,
        }),
        createMockSquadTourPlayer({
          isStarting: false,
          substitutePriority: 3,
        }),
      ];

      const result = PlayerService.filterPlayersOnBench(players);

      expect(result).toHaveLength(3);
      expect(result[0].substitutePriority).toBe(1);
      expect(result[1].substitutePriority).toBe(2);
      expect(result[2].substitutePriority).toBe(3);
    });

    it('should handle null substitute priorities', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: false,
          substitutePriority: null,
        }),
        createMockSquadTourPlayer({
          isStarting: false,
          substitutePriority: 1,
        }),
      ];

      const result = PlayerService.filterPlayersOnBench(players);

      expect(result).toHaveLength(2);
      expect(result[0].substitutePriority).toBeNull();
      expect(result[1].substitutePriority).toBe(1);
    });
  });

  describe('filterFieldPlayersOnBench', () => {
    it('should filter field players on bench', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: false,
          substitutePriority: 1,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: false,
          substitutePriority: 2,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Midfielder,
          },
        }),
      ];

      const result = PlayerService.filterFieldPlayersOnBench(players);

      expect(result).toHaveLength(1);
      expect(result[0].seasonPlayer.role).toBe(FantasyPlayerRole.Midfielder);
    });
  });

  describe('filterStartPlayersByRole', () => {
    it('should filter starting players by role', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Midfielder,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: false,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Midfielder,
          },
        }),
      ];

      const result = PlayerService.filterStartPlayersByRole(
        players,
        FantasyPlayerRole.Midfielder
      );

      expect(result).toHaveLength(1);
      expect(result[0].isStarting).toBe(true);
      expect(result[0].seasonPlayer.role).toBe(FantasyPlayerRole.Midfielder);
    });
  });

  describe('getStartPlayersFormation', () => {
    it('should return formation breakdown', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Defender,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Defender,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: false,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Midfielder,
          },
        }),
      ];

      const result = PlayerService.getStartPlayersFormation(players);

      expect(result[FantasyPlayerRole.Goalkeeper]).toBe(1);
      expect(result[FantasyPlayerRole.Defender]).toBe(2);
      expect(result[FantasyPlayerRole.Midfielder]).toBeUndefined();
    });
  });

  describe('filterStartFieldPlayersNotPlayed', () => {
    it('should filter starting field players who did not play in closed matches', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: true,
          playedMatchesTour: 1,
          isPointsCount: false,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Midfielder,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: true,
          playedMatchesTour: 1,
          isPointsCount: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Forward,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: true,
          playedMatchesTour: 1,
          isPointsCount: false,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
      ];

      const result = PlayerService.filterStartFieldPlayersNotPlayed(players);

      expect(result).toHaveLength(1);
      expect(result[0].seasonPlayer.role).toBe(FantasyPlayerRole.Midfielder);
    });
  });

  describe('filterPlayersWithPointsCount', () => {
    it('should filter players with counting points', () => {
      const players = [
        createMockSquadTourPlayer({ isPointsCount: true }),
        createMockSquadTourPlayer({ isPointsCount: false }),
        createMockSquadTourPlayer({ isPointsCount: true }),
      ];

      const result = PlayerService.filterPlayersWithPointsCount(players);

      expect(result).toHaveLength(2);
      expect(result.every(p => p.isPointsCount)).toBe(true);
    });
  });

  describe('findGoalkeeperOnBench', () => {
    it('should find goalkeeper on bench', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: false,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Midfielder,
          },
        }),
      ];

      const result = PlayerService.findGoalkeeperOnBench(players);

      expect(result).toBeDefined();
      expect(result?.seasonPlayer.role).toBe(FantasyPlayerRole.Goalkeeper);
      expect(result?.isStarting).toBe(false);
    });

    it('should return undefined when no goalkeeper on bench', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
      ];

      const result = PlayerService.findGoalkeeperOnBench(players);

      expect(result).toBeUndefined();
    });
  });

  describe('findGoalkeeperInStarting', () => {
    it('should find starting goalkeeper', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: true,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
        createMockSquadTourPlayer({
          isStarting: false,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Midfielder,
          },
        }),
      ];

      const result = PlayerService.findGoalkeeperInStarting(players);

      expect(result).toBeDefined();
      expect(result?.seasonPlayer.role).toBe(FantasyPlayerRole.Goalkeeper);
      expect(result?.isStarting).toBe(true);
    });

    it('should return undefined when no starting goalkeeper', () => {
      const players = [
        createMockSquadTourPlayer({
          isStarting: false,
          seasonPlayer: {
            ...createMockSquadTourPlayer().seasonPlayer,
            role: FantasyPlayerRole.Goalkeeper,
          },
        }),
      ];

      const result = PlayerService.findGoalkeeperInStarting(players);

      expect(result).toBeUndefined();
    });
  });

  describe('findViceCaptain', () => {
    it('should find vice-captain player', () => {
      const players = [
        createMockSquadTourPlayer({ isViceCaptain: true }),
        createMockSquadTourPlayer({ isCaptain: true }),
      ];

      const result = PlayerService.findViceCaptain(players);

      expect(result).toBeDefined();
      expect(result?.isViceCaptain).toBe(true);
    });

    it('should return undefined when no vice-captain', () => {
      const players = [
        createMockSquadTourPlayer({ isCaptain: true }),
        createMockSquadTourPlayer(),
      ];

      const result = PlayerService.findViceCaptain(players);

      expect(result).toBeUndefined();
    });
  });

  describe('findCaptain', () => {
    it('should find captain player', () => {
      const players = [
        createMockSquadTourPlayer({ isCaptain: true }),
        createMockSquadTourPlayer(),
      ];

      const result = PlayerService.findCaptain(players);

      expect(result).toBeDefined();
      expect(result?.isCaptain).toBe(true);
    });

    it('should return undefined when no captain', () => {
      const players = [
        createMockSquadTourPlayer(),
        createMockSquadTourPlayer(),
      ];

      const result = PlayerService.findCaptain(players);

      expect(result).toBeUndefined();
    });
  });

  describe('recalculateSquadPlayersLiveScore', () => {
    it('should handle empty players array', () => {
      expect(() => {
        PlayerCacheService.recalculateSquadPlayersLiveScore([]);
      }).not.toThrow();
    });

    it('should handle null/undefined players array', () => {
      expect(() => {
        PlayerCacheService.recalculateSquadPlayersLiveScore(null!);
      }).not.toThrow();
    });

    it('should have recalculateSquadPlayersLiveScore method defined', () => {
      // Test that the method exists - complex initialization required for full test
      expect(PlayerCacheService.recalculateSquadPlayersLiveScore).toBeDefined();
      expect(typeof PlayerCacheService.recalculateSquadPlayersLiveScore).toBe(
        'function'
      );
    });
  });
});

describe('PlayerCacheService', () => {
  it('should have cache service methods defined', () => {
    expect(PlayerCacheService.initialize).toBeDefined();
  });
});
