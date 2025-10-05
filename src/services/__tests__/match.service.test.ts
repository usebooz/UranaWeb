import { describe, it, expect } from 'vitest';
import { MatchService } from '../match.service';
import { MatchLineupPlayerStatus } from '@/gql';
import { MatchStatus, StatPeriodId, StatWinner } from '@/gql/generated/graphql';
import type { TourMatch } from '@/gql';

// Test helper for creating mock match data
const createMockMatch = (overrides: Partial<TourMatch> = {}): TourMatch => ({
  id: 'match-1',
  matchStatus: MatchStatus.NotStarted,
  scheduledAt: '2024-08-17T15:00:00Z',
  currentTime: '0',
  winner: null,
  periodId: StatPeriodId.FirstHalf,
  hasLineups: false,
  home: {
    score: 0,
    team: {
      id: 'team-home',
      name: 'Home Team',
      logo: { main: 'home-logo.png' },
    },
    lineup: [],
  },
  away: {
    score: 0,
    team: {
      id: 'team-away',
      name: 'Away Team',
      logo: { main: 'away-logo.png' },
    },
    lineup: [],
  },
  prediction: null,
  bettingOdds: [],
  ...overrides,
});

const createMockLineupPlayer = (playerId: string, isStarting = true) => ({
  player: { id: playerId },
  lineupStarting: isStarting,
});

// Helper for creating matches with lineup data
const createMockMatchWithLineup = (
  lineupOverrides: {
    home?: { lineup: ReturnType<typeof createMockLineupPlayer>[] };
    away?: { lineup: ReturnType<typeof createMockLineupPlayer>[] };
  } = {}
): TourMatch => {
  return createMockMatch({
    hasLineups: true,
    home: {
      score: 0,
      team: {
        id: 'team-home',
        name: 'Home Team',
        logo: { main: 'home-logo.png' },
      },
      lineup: lineupOverrides.home?.lineup ?? [],
    },
    away: {
      score: 0,
      team: {
        id: 'team-away',
        name: 'Away Team',
        logo: { main: 'away-logo.png' },
      },
      lineup: lineupOverrides.away?.lineup ?? [],
    },
  } satisfies Partial<TourMatch>);
};

describe('MatchService', () => {
  describe('subEmoji', () => {
    it('should return correct substitute emoji', () => {
      expect(MatchService.subEmoji).toBe('🪑');
    });
  });

  describe('isInProgress', () => {
    it('should return true when match is live', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Live });

      const result = MatchService.isInProgress(match);

      expect(result).toBe(true);
    });

    it('should return false when match is not live', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.NotStarted });

      const result = MatchService.isInProgress(match);

      expect(result).toBe(false);
    });

    it('should return false when match is undefined', () => {
      const result = MatchService.isInProgress();

      expect(result).toBe(false);
    });
  });

  describe('isScoreAvailable', () => {
    it('should return true when match is live', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Live });

      const result = MatchService.isScoreAvailable(match);

      expect(result).toBe(true);
    });

    it('should return true when match is finished', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Ended });

      const result = MatchService.isScoreAvailable(match);

      expect(result).toBe(true);
    });

    it('should return false when match is not started', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.NotStarted });

      const result = MatchService.isScoreAvailable(match);

      expect(result).toBe(false);
    });
  });

  describe('isNotStarted', () => {
    it('should return true for not started match', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.NotStarted });

      const result = MatchService.isNotStarted(match);

      expect(result).toBe(true);
    });

    it('should return true for delayed match', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.StartDelayed });

      const result = MatchService.isNotStarted(match);

      expect(result).toBe(true);
    });

    it('should return true for postponed match', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Postponed });

      const result = MatchService.isNotStarted(match);

      expect(result).toBe(true);
    });

    it('should return false for live match', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Live });

      const result = MatchService.isNotStarted(match);

      expect(result).toBe(false);
    });

    it('should return false when match is undefined', () => {
      const result = MatchService.isNotStarted();

      expect(result).toBe(false);
    });
  });

  describe('isFinished', () => {
    it('should return true for closed match', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Closed });

      const result = MatchService.isFinished(match);

      expect(result).toBe(true);
    });

    it('should return true for ended match', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Ended });

      const result = MatchService.isFinished(match);

      expect(result).toBe(true);
    });

    it('should return false for live match', () => {
      const match = createMockMatch({ matchStatus: MatchStatus.Live });

      const result = MatchService.isFinished(match);

      expect(result).toBe(false);
    });

    it('should return false when match is undefined', () => {
      const result = MatchService.isFinished();

      expect(result).toBe(false);
    });
  });

  describe('formatCurrentTime', () => {
    it('should return "перерыв" during half time', () => {
      const match = createMockMatch({
        periodId: StatPeriodId.HalfTime,
        currentTime: '45',
      });

      const result = MatchService.formatCurrentTime(match);

      expect(result).toBe('перерыв');
    });

    it('should format current time with apostrophe', () => {
      const match = createMockMatch({
        periodId: StatPeriodId.FirstHalf,
        currentTime: '35',
      });

      const result = MatchService.formatCurrentTime(match);

      expect(result).toBe("35'");
    });

    it('should handle zero time', () => {
      const match = createMockMatch({
        periodId: StatPeriodId.FirstHalf,
        currentTime: '0',
      });

      const result = MatchService.formatCurrentTime(match);

      expect(result).toBe("0'");
    });
  });

  describe('isHomeWinner', () => {
    it('should return true when match is finished and home team won', () => {
      const match = createMockMatch({
        matchStatus: MatchStatus.Ended,
        winner: StatWinner.Home,
      });

      const result = MatchService.isHomeWinner(match);

      expect(result).toBe(true);
    });

    it('should return false when match is not finished', () => {
      const match = createMockMatch({
        matchStatus: MatchStatus.Live,
        winner: StatWinner.Home,
      });

      const result = MatchService.isHomeWinner(match);

      expect(result).toBe(false);
    });

    it('should return false when away team won', () => {
      const match = createMockMatch({
        matchStatus: MatchStatus.Ended,
        winner: StatWinner.Away,
      });

      const result = MatchService.isHomeWinner(match);

      expect(result).toBe(false);
    });
  });

  describe('isAwayWinner', () => {
    it('should return true when match is finished and away team won', () => {
      const match = createMockMatch({
        matchStatus: MatchStatus.Ended,
        winner: StatWinner.Away,
      });

      const result = MatchService.isAwayWinner(match);

      expect(result).toBe(true);
    });

    it('should return false when match is not finished', () => {
      const match = createMockMatch({
        matchStatus: MatchStatus.Live,
        winner: StatWinner.Away,
      });

      const result = MatchService.isAwayWinner(match);

      expect(result).toBe(false);
    });

    it('should return false when home team won', () => {
      const match = createMockMatch({
        matchStatus: MatchStatus.Ended,
        winner: StatWinner.Home,
      });

      const result = MatchService.isAwayWinner(match);

      expect(result).toBe(false);
    });
  });

  describe('filterMatchesStarted', () => {
    it('should filter out not started matches', () => {
      const matches = [
        createMockMatch({ id: 'match-1', matchStatus: MatchStatus.Live }),
        createMockMatch({ id: 'match-2', matchStatus: MatchStatus.NotStarted }),
        createMockMatch({ id: 'match-3', matchStatus: MatchStatus.Ended }),
        createMockMatch({ id: 'match-4', matchStatus: MatchStatus.Postponed }),
      ];

      const result = MatchService.filterMatchesStarted(matches);

      expect(result).toHaveLength(2);
      expect(result?.map(m => m.id)).toEqual(['match-1', 'match-3']);
    });

    it('should return undefined when matches array is undefined', () => {
      const result = MatchService.filterMatchesStarted();

      expect(result).toBeUndefined();
    });

    it('should return empty array when all matches are not started', () => {
      const matches = [
        createMockMatch({ matchStatus: MatchStatus.NotStarted }),
        createMockMatch({ matchStatus: MatchStatus.Postponed }),
      ];

      const result = MatchService.filterMatchesStarted(matches);

      expect(result).toEqual([]);
    });
  });

  describe('findMatchByTeamId', () => {
    it('should find match by home team ID', () => {
      const matches = [
        createMockMatch({
          id: 'match-1',
          home: {
            score: 0,
            team: { id: 'team-1', name: 'Team 1', logo: { main: 'logo1.png' } },
            lineup: [],
          },
        }),
        createMockMatch({
          id: 'match-2',
          home: {
            score: 0,
            team: { id: 'team-2', name: 'Team 2', logo: { main: 'logo2.png' } },
            lineup: [],
          },
        }),
      ];

      const result = MatchService.findMatchByTeamId(matches, 'team-1');

      expect(result?.id).toBe('match-1');
    });

    it('should find match by away team ID', () => {
      const matches = [
        createMockMatch({
          id: 'match-1',
          away: {
            score: 0,
            team: { id: 'team-1', name: 'Team 1', logo: { main: 'logo1.png' } },
            lineup: [],
          },
        }),
        createMockMatch({
          id: 'match-2',
          away: {
            score: 0,
            team: { id: 'team-2', name: 'Team 2', logo: { main: 'logo2.png' } },
            lineup: [],
          },
        }),
      ];

      const result = MatchService.findMatchByTeamId(matches, 'team-1');

      expect(result?.id).toBe('match-1');
    });

    it('should return undefined when team not found', () => {
      const matches = [
        createMockMatch({
          home: {
            score: 0,
            team: { id: 'team-1', name: 'Team 1', logo: { main: 'logo1.png' } },
            lineup: [],
          },
          away: {
            score: 0,
            team: { id: 'team-2', name: 'Team 2', logo: { main: 'logo2.png' } },
            lineup: [],
          },
        }),
      ];

      const result = MatchService.findMatchByTeamId(matches, 'team-999');

      expect(result).toBeUndefined();
    });

    it('should return undefined when matches array is undefined', () => {
      const result = MatchService.findMatchByTeamId(undefined, 'team-1');

      expect(result).toBeUndefined();
    });
  });

  describe('getLineupPlayerStatus', () => {
    it('should return undefined when player ID is not provided', () => {
      const match = createMockMatch({ hasLineups: true });

      const result = MatchService.getLineupPlayerStatus(match);

      expect(result).toBeUndefined();
    });

    it('should return undefined when match has no lineups', () => {
      const match = createMockMatch({ hasLineups: false });

      const result = MatchService.getLineupPlayerStatus(match, 'player-1');

      expect(result).toBeUndefined();
    });

    it('should return Starting status for starting player', () => {
      const match = createMockMatchWithLineup({
        home: {
          lineup: [createMockLineupPlayer('player-1', true)],
        },
      });

      const result = MatchService.getLineupPlayerStatus(match, 'player-1');

      expect(result).toBe(MatchLineupPlayerStatus.Starting);
    });

    it('should return Substituted status for substitute player', () => {
      const match = createMockMatchWithLineup({
        home: {
          lineup: [createMockLineupPlayer('player-1', false)],
        },
      });

      const result = MatchService.getLineupPlayerStatus(match, 'player-1');

      expect(result).toBe(MatchLineupPlayerStatus.Substituted);
    });

    it('should return NotInLineup status for player not in lineup', () => {
      const match = createMockMatchWithLineup({
        home: { lineup: [] },
        away: { lineup: [] },
      });

      const result = MatchService.getLineupPlayerStatus(match, 'player-999');

      expect(result).toBe(MatchLineupPlayerStatus.NotInLineup);
    });

    it('should return emoji when emoji flag is true', () => {
      const match = createMockMatchWithLineup({
        home: {
          lineup: [createMockLineupPlayer('player-1', true)],
        },
      });

      const result = MatchService.getLineupPlayerStatus(
        match,
        'player-1',
        true
      );

      expect(result).toBe('✅');
    });

    it('should return substitute emoji for substitute player', () => {
      const match = createMockMatchWithLineup({
        home: {
          lineup: [createMockLineupPlayer('player-1', false)],
        },
      });

      const result = MatchService.getLineupPlayerStatus(
        match,
        'player-1',
        true
      );

      expect(result).toBe('🪑');
    });

    it('should return not-in-lineup emoji for player not in lineup', () => {
      const match = createMockMatchWithLineup({
        home: { lineup: [] },
        away: { lineup: [] },
      });

      const result = MatchService.getLineupPlayerStatus(
        match,
        'player-999',
        true
      );

      expect(result).toBe('❌');
    });

    it('should handle null home and away lineups', () => {
      const match = createMockMatch({
        hasLineups: true,
        home: null,
        away: null,
      } satisfies Partial<TourMatch>);

      const result = MatchService.getLineupPlayerStatus(match, 'player-1');

      expect(result).toBe(MatchLineupPlayerStatus.NotInLineup);
    });
  });

  describe('isPlayerInLineup', () => {
    it('should return true for starting player', () => {
      const match = createMockMatchWithLineup({
        home: {
          lineup: [createMockLineupPlayer('player-1', true)],
        },
      });

      const result = MatchService.isPlayerInLineup(match, 'player-1');

      expect(result).toBe(true);
    });

    it('should return true for substitute player', () => {
      const match = createMockMatchWithLineup({
        home: {
          lineup: [createMockLineupPlayer('player-1', false)],
        },
      });

      const result = MatchService.isPlayerInLineup(match, 'player-1');

      expect(result).toBe(true);
    });

    it('should return false for player not in lineup', () => {
      const match = createMockMatchWithLineup({
        home: { lineup: [] },
        away: { lineup: [] },
      });

      const result = MatchService.isPlayerInLineup(match, 'player-999');

      expect(result).toBe(false);
    });
  });

  describe('formatMatchScheduledAt', () => {
    it('should format scheduled time correctly in Russian locale', () => {
      const match = createMockMatch({
        scheduledAt: '2024-08-17T15:00:00Z',
      });

      const result = MatchService.formatMatchScheduledAt(match);

      expect(result).toMatch(/сб/);
      expect(result).toMatch(/\d{2}:\d{2}/); // Any valid time format
    });

    it('should return undefined when scheduledAt is not provided', () => {
      const match = createMockMatch({ scheduledAt: undefined });

      const result = MatchService.formatMatchScheduledAt(match);

      expect(result).toBeUndefined();
    });

    it('should return undefined when scheduledAt is not a string', () => {
      const match = createMockMatch({
        scheduledAt: 123 as unknown as string,
      });

      const result = MatchService.formatMatchScheduledAt(match);

      expect(result).toBeUndefined();
    });
  });
});
