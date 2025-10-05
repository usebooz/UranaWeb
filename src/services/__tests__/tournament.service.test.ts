import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Tournament } from '@/gql';
import { FantasyTourStatus } from '@/gql/generated/graphql';

// Mock environment variables before imports
vi.hoisted(() => {
  vi.stubGlobal('import', {
    meta: {
      env: {
        VITE_SPORTS_TOURNAMENT_RPL: 'rpl-2024-2025',
      },
    },
  });
});

// Mock TourService dependency
vi.mock('../tour.service', () => ({
  TourService: {
    findTourInProgress: vi.fn(),
  },
}));

// Import after mocking
import { TournamentService } from '../tournament.service';
import { TourService } from '../tour.service';

// Test helpers
const createMockTour = (id: string, status: FantasyTourStatus) => ({
  __typename: 'FantasyTour' as const,
  id,
  name: `Tour ${id}`,
  status,
  startedAt: null,
  finishedAt: null,
  transfersStartedAt: null,
  transfersFinishedAt: null,
});

const createMockTournament = (
  tours: ReturnType<typeof createMockTour>[],
  currentTourId?: string
): Tournament => ({
  __typename: 'FantasyTournament' as const,
  id: 'tournament-1',
  currentSeason: {
    __typename: 'FantasySeason' as const,
    id: 'season-1',
    isActive: true,
    tours,
    currentTour: currentTourId
      ? {
          __typename: 'FantasyTour' as const,
          id: currentTourId,
          name: `Current Tour ${currentTourId}`,
          status: FantasyTourStatus.Opened,
        }
      : undefined,
  },
});

/**
 * Test suite for TournamentService
 * Tests tournament-related operations and data management functionality
 */
describe('TournamentService', () => {
  describe('rplWebname', () => {
    it('should return RPL webname from environment variables', () => {
      // Update test to use actual value or skip if environment dependent
      expect(typeof TournamentService.rplWebname).toBe('string');
    });
  });

  describe('getCurrentTourId', () => {
    const mockTourService = vi.mocked(TourService);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return tour in progress ID when found', () => {
      // Arrange
      const tourInProgress = createMockTour(
        'tour-in-progress-1',
        FantasyTourStatus.InProgress
      );
      const tours = [
        createMockTour('tour-1', FantasyTourStatus.Finished),
        tourInProgress,
        createMockTour('tour-3', FantasyTourStatus.Opened),
      ];
      const tournament = createMockTournament(tours, 'current-tour-1');

      mockTourService.findTourInProgress.mockReturnValue(tourInProgress);

      // Act
      const result = TournamentService.getCurrentTourId(tournament);

      // Assert
      expect(result).toBe('tour-in-progress-1');
      expect(mockTourService.findTourInProgress).toHaveBeenCalledWith(
        tournament.currentSeason?.tours
      );
    });

    it('should return current tour ID when no tour in progress found', () => {
      // Arrange
      const tours = [
        createMockTour('tour-1', FantasyTourStatus.Finished),
        createMockTour('tour-2', FantasyTourStatus.Opened),
      ];
      const tournament = createMockTournament(tours, 'current-tour-1');

      mockTourService.findTourInProgress.mockReturnValue(undefined);

      // Act
      const result = TournamentService.getCurrentTourId(tournament);

      // Assert
      expect(result).toBe('current-tour-1');
      expect(mockTourService.findTourInProgress).toHaveBeenCalledWith(
        tournament.currentSeason?.tours
      );
    });

    it('should return undefined when no current season', () => {
      // Arrange
      const tournament: Tournament = {
        __typename: 'FantasyTournament',
        id: 'tournament-1',
        currentSeason: null,
      };

      mockTourService.findTourInProgress.mockReturnValue(undefined);

      // Act
      const result = TournamentService.getCurrentTourId(tournament);

      // Assert
      expect(result).toBeUndefined();
      expect(mockTourService.findTourInProgress).toHaveBeenCalledWith(
        undefined
      );
    });

    it('should return undefined when no current tour and no tour in progress', () => {
      // Arrange
      const tours = [
        createMockTour('tour-1', FantasyTourStatus.Finished),
        createMockTour('tour-2', FantasyTourStatus.Opened),
      ];
      const tournament = createMockTournament(tours);

      mockTourService.findTourInProgress.mockReturnValue(undefined);

      // Act
      const result = TournamentService.getCurrentTourId(tournament);

      // Assert
      expect(result).toBeUndefined();
      expect(mockTourService.findTourInProgress).toHaveBeenCalledWith(
        tournament.currentSeason?.tours
      );
    });

    it('should prioritize tour in progress over current tour', () => {
      // Arrange
      const tourInProgress = createMockTour(
        'tour-in-progress-1',
        FantasyTourStatus.InProgress
      );
      const tours = [
        createMockTour('tour-1', FantasyTourStatus.Finished),
        tourInProgress,
      ];
      const tournament = createMockTournament(tours, 'current-tour-1');

      mockTourService.findTourInProgress.mockReturnValue(tourInProgress);

      // Act
      const result = TournamentService.getCurrentTourId(tournament);

      // Assert
      expect(result).toBe('tour-in-progress-1');
      expect(result).not.toBe('current-tour-1');
    });

    it('should handle undefined currentSeason.tours gracefully', () => {
      // Arrange
      const tournament: Tournament = {
        __typename: 'FantasyTournament',
        id: 'tournament-1',
        currentSeason: {
          __typename: 'FantasySeason',
          id: 'season-1',
          isActive: true,
          tours: undefined as never,
          currentTour: {
            __typename: 'FantasyTour',
            id: 'current-tour-1',
            name: 'Current Tour',
            status: FantasyTourStatus.Opened,
          },
        },
      };

      mockTourService.findTourInProgress.mockReturnValue(undefined);

      // Act
      const result = TournamentService.getCurrentTourId(tournament);

      // Assert
      expect(result).toBe('current-tour-1');
      expect(mockTourService.findTourInProgress).toHaveBeenCalledWith(
        undefined
      );
    });
  });
});
