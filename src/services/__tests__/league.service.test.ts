import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { LeagueService } from '../league.service';
import { FantasyLeagueType } from '@/gql/generated/graphql';
import type { League } from '@/gql';

// Mock import.meta.env for tests
beforeAll(() => {
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_SPORTS_TOURNAMENT_RPL: 'rpl-2024-2025',
    },
    writable: true,
  });
});

afterAll(() => {
  Object.defineProperty(import.meta, 'env', {
    value: {},
    writable: true,
  });
});

// Test helper for creating mock league data
const createMockLeague = (overrides: Partial<League> = {}): League => ({
  id: 'league-1',
  name: 'Fantasy League 1',
  type: FantasyLeagueType.User,
  season: {
    id: 'season-2024',
  },
  ...overrides,
});

describe('LeagueService', () => {
  describe('rplWebname', () => {
    it('should return RPL webname from environment variables', () => {
      expect(LeagueService.rplWebname).toBe('rpl-2024-2025');
      expect(typeof LeagueService.rplWebname).toBe('string');
    });
  });

  describe('isFromCurrentSeason', () => {
    it('should return true when league belongs to specified season', () => {
      const league = createMockLeague({
        season: { id: 'season-2024' },
      });

      const result = LeagueService.isFromCurrentSeason(league, 'season-2024');

      expect(result).toBe(true);
    });

    it('should return false when league does not belong to specified season', () => {
      const league = createMockLeague({
        season: { id: 'season-2023' },
      });

      const result = LeagueService.isFromCurrentSeason(league, 'season-2024');

      expect(result).toBe(false);
    });

    it('should return false when seasonId is undefined', () => {
      const league = createMockLeague({
        season: { id: 'season-2024' },
      });

      const result = LeagueService.isFromCurrentSeason(league);

      expect(result).toBe(false);
    });

    it('should handle different season ID formats', () => {
      const league = createMockLeague({
        season: { id: 'rpl-2024-2025' },
      });

      const result = LeagueService.isFromCurrentSeason(league, 'rpl-2024-2025');

      expect(result).toBe(true);
    });

    it('should be case sensitive for season IDs', () => {
      const league = createMockLeague({
        season: { id: 'Season-2024' },
      });

      const result = LeagueService.isFromCurrentSeason(league, 'season-2024');

      expect(result).toBe(false);
    });
  });
});
