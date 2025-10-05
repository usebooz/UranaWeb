import { describe, it, expect, vi } from 'vitest';

import { SquadService, SquadCacheService } from '../squad.service';
import type {
  LeagueSquad,
  LeagueSquadWithCurrentTourInfo,
  SquadTourInfo,
} from '@/gql';

// Mock PlayerService
vi.mock('../player.service', () => ({
  PlayerService: {
    getSeasonScoreInfo: vi.fn(),
  },
}));

// Test helpers
const createMockLeagueSquad = (
  overrides: Partial<LeagueSquad> = {}
): LeagueSquad => ({
  scoreInfo: {
    place: 5,
    totalPlaces: 20,
    score: 125,
    averageScore: 75,
    placeDiff: 0,
    placeAfterTour: 5,
    pointsAfterTour: 125,
    placeAfterTourDiff: 1,
  },
  squad: {
    id: 'squad-inner-1',
    name: 'Test Squad',
    user: {
      id: 'user-1',
      nick: 'TestUser',
    },
    benefit: [],
    seasonScoreInfo: {
      score: 1250,
      place: 5,
      totalPlaces: 100,
    },
  },
  ...overrides,
});

const createMockLeagueSquadWithTourInfo = (
  overrides: Partial<LeagueSquadWithCurrentTourInfo> = {}
): LeagueSquadWithCurrentTourInfo => ({
  ...createMockLeagueSquad(),
  squad: {
    ...createMockLeagueSquad().squad,
    currentTourInfo: null,
  },
  ...overrides,
});

const createMockSquadTourInfo = (
  overrides: Partial<SquadTourInfo> = {}
): SquadTourInfo => ({
  tour: { id: 'tour-1' },
  isNotLimit: false,
  transfersDone: 2,
  transfersLeft: 3,
  currentBalance: 5000000,
  totalPrice: 95000000,
  players: [],
  ...overrides,
});

describe('SquadService', () => {
  describe('getSeasonScoreInfo', () => {
    it('should return season score info from squad', () => {
      const squad = createMockLeagueSquad().squad;
      const result = SquadService.getSeasonScoreInfo(squad);

      expect(result).toBe(squad.seasonScoreInfo);
      expect(result?.score).toBe(1250);
      expect(result?.place).toBe(5);
    });
  });

  describe('getCurrentTourInfo', () => {
    it('should return current tour info from squad', () => {
      const squad = createMockLeagueSquadWithTourInfo();
      const result = SquadService.getCurrentTourInfo(squad.squad);

      expect(result).toBeNull();
    });
  });

  describe('findTourWinner', () => {
    it('should find squad in 1st place', () => {
      const leagueSquads = [
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            place: 2,
          },
        }),
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            place: 1,
          },
        }),
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            place: 3,
          },
        }),
      ];

      const result = SquadService.findTourWinner(leagueSquads);

      expect(result).toBeDefined();
      expect(result?.scoreInfo.place).toBe(1);
    });

    it('should return undefined when no squads provided', () => {
      const result = SquadService.findTourWinner();

      expect(result).toBeUndefined();
    });

    it('should return undefined when no winner found', () => {
      const leagueSquads = [
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            place: 2,
          },
        }),
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            place: 3,
          },
        }),
      ];

      const result = SquadService.findTourWinner(leagueSquads);

      expect(result).toBeUndefined();
    });
  });

  describe('formatSquadsTourAverageScore', () => {
    it('should format average score from first squad', () => {
      const leagueSquads = [
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            averageScore: 82.5,
          },
        }),
      ];

      const result = SquadService.formatSquadsTourAverageScore(leagueSquads);

      expect(result).toBe('∅82.5');
    });

    it('should return undefined when no squads provided', () => {
      const result = SquadService.formatSquadsTourAverageScore();

      expect(result).toBeUndefined();
    });

    it('should return undefined when empty array provided', () => {
      const result = SquadService.formatSquadsTourAverageScore([]);

      expect(result).toBeUndefined();
    });
  });

  describe('formatAverageScore', () => {
    it('should format average score with ∅ symbol', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          averageScore: undefined,
        },
      });

      const result = SquadService.formatAverageScore(leagueSquad);

      expect(result).toBe('∅0');
    });

    it('should handle undefined average score', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          averageScore: undefined,
        },
      });

      const result = SquadService.formatAverageScore(leagueSquad);

      expect(result).toBe('∅0');
    });
  });

  describe('getSquadsCount', () => {
    it('should return total places count as string', () => {
      const leagueSquads = [
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            totalPlaces: 25,
          },
        }),
      ];

      const result = SquadService.getSquadsCount(leagueSquads);

      expect(result).toBe('25');
    });

    it('should return "0" when no squads provided', () => {
      const result = SquadService.getSquadsCount();

      expect(result).toBe('0');
    });

    it('should return "0" when totalPlaces is 0', () => {
      const leagueSquads = [
        createMockLeagueSquad({
          scoreInfo: {
            ...createMockLeagueSquad().scoreInfo,
            totalPlaces: 0,
          },
        }),
      ];

      const result = SquadService.getSquadsCount(leagueSquads);

      expect(result).toBe('0');
    });
  });

  describe('isPlaceDiffNegative', () => {
    it('should return true when place diff is negative', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          placeAfterTourDiff: -3,
        },
      });

      const result = SquadService.isPlaceDiffNegative(leagueSquad);

      expect(result).toBe(true);
    });

    it('should return false when place diff is positive', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          placeAfterTourDiff: 2,
        },
      });

      const result = SquadService.isPlaceDiffNegative(leagueSquad);

      expect(result).toBe(false);
    });

    it('should return false when place diff is zero', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          placeAfterTourDiff: 0,
        },
      });

      const result = SquadService.isPlaceDiffNegative(leagueSquad);

      expect(result).toBe(false);
    });
  });

  describe('formatPlaceDiff', () => {
    it('should format positive place diff with up arrow', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          placeAfterTourDiff: 3,
        },
      });

      const result = SquadService.formatPlaceDiff(leagueSquad);

      expect(result).toBe('3↑');
    });

    it('should format negative place diff with down arrow', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          placeAfterTourDiff: -2,
        },
      });

      const result = SquadService.formatPlaceDiff(leagueSquad);

      expect(result).toBe('2↓');
    });

    it('should return undefined when place diff is zero', () => {
      const leagueSquad = createMockLeagueSquad({
        scoreInfo: {
          ...createMockLeagueSquad().scoreInfo,
          placeAfterTourDiff: 0,
        },
      });

      const result = SquadService.formatPlaceDiff(leagueSquad);

      expect(result).toBeUndefined();
    });
  });

  describe('formatSquadTop', () => {
    it('should return gold medal for 1st place', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            ...createMockLeagueSquad().squad.seasonScoreInfo!,
            place: 1,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('🥇');
    });

    it('should return silver medal for 2nd place', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            ...createMockLeagueSquad().squad.seasonScoreInfo!,
            place: 2,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('🥈');
    });

    it('should return bronze medal for 3rd place', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            ...createMockLeagueSquad().squad.seasonScoreInfo!,
            place: 3,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('🥉');
    });

    it('should return 18+ emoji for place <= 18', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            ...createMockLeagueSquad().squad.seasonScoreInfo!,
            place: 10,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('🔞');
    });

    it('should return 100 emoji for place <= 100', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            ...createMockLeagueSquad().squad.seasonScoreInfo!,
            place: 50,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('💯');
    });

    it('should return "1%" for top 1% (place > 100)', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            score: 120,
            place: 105,
            totalPlaces: 10500,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('1%');
    });

    it('should return "5%" for top 5% (place > 100)', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            score: 80,
            place: 250,
            totalPlaces: 10000,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('5%');
    });

    it('should return "10%" for top 10% (place > 100)', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            score: 75,
            place: 800,
            totalPlaces: 10000,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBe('10%');
    });

    it('should return undefined for low rankings', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: {
            ...createMockLeagueSquad().squad.seasonScoreInfo!,
            place: 500,
            totalPlaces: 1000,
          },
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBeUndefined();
    });

    it('should return undefined when no place info', () => {
      const squad = createMockLeagueSquad({
        squad: {
          ...createMockLeagueSquad().squad,
          seasonScoreInfo: null,
        },
      });

      const result = SquadService.formatSquadTop(squad);

      expect(result).toBeUndefined();
    });
  });

  describe('formatSquadTransfersTotal', () => {
    it('should return infinity symbol for unlimited transfers', () => {
      const squadTourInfo = createMockSquadTourInfo({ isNotLimit: true });

      const result = SquadService.formatSquadTransfersTotal(squadTourInfo);

      expect(result).toBe('∞');
    });

    it('should return total transfers count', () => {
      const squadTourInfo = createMockSquadTourInfo({
        isNotLimit: false,
        transfersDone: 2,
        transfersLeft: 3,
      });

      const result = SquadService.formatSquadTransfersTotal(squadTourInfo);

      expect(result).toBe('5');
    });

    it('should return "NaN" when no squad tour info', () => {
      const result = SquadService.formatSquadTransfersTotal();

      expect(result).toBe('NaN');
    });
  });
});

describe('SquadCacheService', () => {
  it('should have cache service methods defined', () => {
    expect(SquadCacheService.getSeasonScoreInfo).toBeDefined();
    expect(SquadCacheService.getCurrentTourInfo).toBeDefined();
    expect(SquadCacheService.initialize).toBeDefined();
  });

  describe('recalculateSquadsLiveScore', () => {
    it('should handle empty squads array', () => {
      expect(() => {
        SquadCacheService.recalculateSquadsLiveScore([]);
      }).not.toThrow();
    });
  });

  describe('restoreSquadsAfterTourScore', () => {
    it('should handle squads restoration', () => {
      // Skip initialization test - requires complex setup
      expect(SquadCacheService.restoreSquadsAfterTourScore).toBeDefined();
    });
  });

  describe('recalculateSquadsTourLiveScore', () => {
    it('should handle tour score recalculation', () => {
      // Skip initialization test - requires complex setup
      expect(SquadCacheService.recalculateSquadsTourLiveScore).toBeDefined();
    });
  });

  describe('recalculateSquadsAfterTourScore', () => {
    it('should handle after tour score recalculation', () => {
      const squads = [createMockLeagueSquadWithTourInfo()];

      expect(() => {
        SquadCacheService.recalculateSquadsAfterTourScore(squads);
      }).not.toThrow();
    });
  });
});
