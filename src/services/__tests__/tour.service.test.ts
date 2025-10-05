import { describe, it, expect } from 'vitest';
import { TourService } from '../tour.service';
import { FantasyTourStatus } from '@/gql/generated/graphql';
import type { Tour } from '@/gql';

// Test helpers for creating mock tour data
const createMockTour = (overrides: Partial<Tour> = {}): Tour => ({
  id: 'tour-1',
  name: 'Тур 1',
  status: FantasyTourStatus.Opened,
  startedAt: '2024-08-17T10:00:00Z',
  ...overrides,
});

const createMockTours = (): Tour[] => [
  createMockTour({ id: 'tour-1', status: FantasyTourStatus.Finished }),
  createMockTour({ id: 'tour-2', status: FantasyTourStatus.InProgress }),
  createMockTour({ id: 'tour-3', status: FantasyTourStatus.Opened }),
  createMockTour({ id: 'tour-4', status: FantasyTourStatus.NotStarted }),
];

describe('TourService', () => {
  describe('isFromCurrentSeason', () => {
    it('should return true when tour exists in current season tours', () => {
      const tour = createMockTour({ id: 'tour-1' });
      const tours = createMockTours();

      const result = TourService.isFromCurrentSeason(tour, tours);

      expect(result).toBe(true);
    });

    it('should return false when tour does not exist in current season tours', () => {
      const tour = createMockTour({ id: 'tour-999' });
      const tours = createMockTours();

      const result = TourService.isFromCurrentSeason(tour, tours);

      expect(result).toBe(false);
    });

    it('should return false when tours array is undefined', () => {
      const tour = createMockTour({ id: 'tour-1' });

      const result = TourService.isFromCurrentSeason(tour);

      expect(result).toBe(false);
    });

    it('should return false when tours array is empty', () => {
      const tour = createMockTour({ id: 'tour-1' });

      const result = TourService.isFromCurrentSeason(tour, []);

      expect(result).toBe(false);
    });
  });

  describe('filterAvailableTours', () => {
    it('should filter and return only available tours', () => {
      const tours = createMockTours();

      const result = TourService.filterAvailableTours(tours);

      expect(result).toHaveLength(3);
      expect(result?.map(t => t.id)).toEqual(['tour-1', 'tour-2', 'tour-3']);
    });

    it('should return undefined when tours array is undefined', () => {
      const result = TourService.filterAvailableTours();

      expect(result).toBeUndefined();
    });

    it('should return empty array when no tours are available', () => {
      const tours = [createMockTour({ status: FantasyTourStatus.NotStarted })];

      const result = TourService.filterAvailableTours(tours);

      expect(result).toEqual([]);
    });
  });

  describe('getTourIdByNumber', () => {
    it('should return tour ID by 1-based number', () => {
      const tours = createMockTours();

      const result = TourService.getTourIdByNumber(2, tours);

      expect(result).toBe('tour-2');
    });

    it('should return undefined when tour number is out of bounds', () => {
      const tours = createMockTours();

      const result = TourService.getTourIdByNumber(10, tours);

      expect(result).toBeUndefined();
    });

    it('should return undefined when tours array is undefined', () => {
      const result = TourService.getTourIdByNumber(1);

      expect(result).toBeUndefined();
    });

    it('should return undefined when tour number is zero or negative', () => {
      const tours = createMockTours();

      expect(TourService.getTourIdByNumber(0, tours)).toBeUndefined();
      expect(TourService.getTourIdByNumber(-1, tours)).toBeUndefined();
    });
  });

  describe('getTourNumberById', () => {
    it('should return 1-based tour number by ID', () => {
      const tours = createMockTours();

      const result = TourService.getTourNumberById('tour-2', tours);

      expect(result).toBe(2);
    });

    it('should return undefined when tour ID is not found', () => {
      const tours = createMockTours();

      const result = TourService.getTourNumberById('tour-999', tours);

      expect(result).toBeUndefined();
    });

    it('should return undefined when tour ID is undefined', () => {
      const tours = createMockTours();

      const result = TourService.getTourNumberById(undefined, tours);

      expect(result).toBeUndefined();
    });

    it('should return undefined when tours array is undefined', () => {
      const result = TourService.getTourNumberById('tour-1');

      expect(result).toBeUndefined();
    });
  });

  describe('findTourInProgress', () => {
    it('should return tour that is in progress', () => {
      const tours = createMockTours();

      const result = TourService.findTourInProgress(tours);

      expect(result?.id).toBe('tour-2');
      expect(result?.status).toBe(FantasyTourStatus.InProgress);
    });

    it('should return undefined when no tour is in progress', () => {
      const tours = [
        createMockTour({ status: FantasyTourStatus.Finished }),
        createMockTour({ status: FantasyTourStatus.Opened }),
      ];

      const result = TourService.findTourInProgress(tours);

      expect(result).toBeUndefined();
    });

    it('should return undefined when tours array is undefined', () => {
      const result = TourService.findTourInProgress();

      expect(result).toBeUndefined();
    });
  });

  describe('isAvailable', () => {
    it('should return true for finished tour', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Finished });

      const result = TourService.isAvailable(tour);

      expect(result).toBe(true);
    });

    it('should return true for in progress tour', () => {
      const tour = createMockTour({ status: FantasyTourStatus.InProgress });

      const result = TourService.isAvailable(tour);

      expect(result).toBe(true);
    });

    it('should return true for opened tour', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Opened });

      const result = TourService.isAvailable(tour);

      expect(result).toBe(true);
    });

    it('should return false for not started tour', () => {
      const tour = createMockTour({ status: FantasyTourStatus.NotStarted });

      const result = TourService.isAvailable(tour);

      expect(result).toBe(false);
    });
  });

  describe('isInProgress', () => {
    it('should return true when tour is in progress', () => {
      const tour = createMockTour({ status: FantasyTourStatus.InProgress });

      const result = TourService.isInProgress(tour);

      expect(result).toBe(true);
    });

    it('should return false when tour is not in progress', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Finished });

      const result = TourService.isInProgress(tour);

      expect(result).toBe(false);
    });
  });

  describe('isOpened', () => {
    it('should return true when tour is opened', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Opened });

      const result = TourService.isOpened(tour);

      expect(result).toBe(true);
    });

    it('should return false when tour is not opened', () => {
      const tour = createMockTour({ status: FantasyTourStatus.InProgress });

      const result = TourService.isOpened(tour);

      expect(result).toBe(false);
    });
  });

  describe('isFinished', () => {
    it('should return true when tour is finished', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Finished });

      const result = TourService.isFinished(tour);

      expect(result).toBe(true);
    });

    it('should return false when tour is not finished', () => {
      const tour = createMockTour({ status: FantasyTourStatus.InProgress });

      const result = TourService.isFinished(tour);

      expect(result).toBe(false);
    });
  });

  describe('isScoreAvailable', () => {
    it('should return true when tour is finished', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Finished });

      const result = TourService.isScoreAvailable(tour);

      expect(result).toBe(true);
    });

    it('should return true when tour is in progress', () => {
      const tour = createMockTour({ status: FantasyTourStatus.InProgress });

      const result = TourService.isScoreAvailable(tour);

      expect(result).toBe(true);
    });

    it('should return false when tour is opened', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Opened });

      const result = TourService.isScoreAvailable(tour);

      expect(result).toBe(false);
    });
  });

  describe('formatStartDate', () => {
    it('should format date correctly in Russian locale', () => {
      const tour = createMockTour({ startedAt: '2024-08-17T10:00:00Z' });

      const result = TourService.formatStartDate(tour);

      expect(result).toMatch(/17 августа/);
      expect(result).toMatch(/13:00/);
    });

    it('should return undefined when startedAt is null', () => {
      const tour = createMockTour({ startedAt: null });

      const result = TourService.formatStartDate(tour);

      expect(result).toBeUndefined();
    });

    it('should return undefined when startedAt is not a string', () => {
      const tour = createMockTour({ startedAt: 123 as unknown as string });

      const result = TourService.formatStartDate(tour);

      expect(result).toBeUndefined();
    });

    it('should return undefined when startedAt is invalid date string', () => {
      const tour = createMockTour({ startedAt: 'invalid-date' });

      const result = TourService.formatStartDate(tour);

      expect(result).toBeUndefined();
    });
  });

  describe('formatStatus', () => {
    it('should return "закончен" for finished tour', () => {
      const tour = createMockTour({ status: FantasyTourStatus.Finished });

      const result = TourService.formatStatus(tour);

      expect(result).toBe('закончен');
    });

    it('should return "идет" for in progress tour', () => {
      const tour = createMockTour({ status: FantasyTourStatus.InProgress });

      const result = TourService.formatStatus(tour);

      expect(result).toBe('идет');
    });

    it('should return start time for opened tour', () => {
      const tour = createMockTour({
        status: FantasyTourStatus.Opened,
        startedAt: '2024-08-17T10:00:00Z',
      });

      const result = TourService.formatStatus(tour);

      expect(result).toMatch(/стартует/);
      expect(result).toMatch(/17 августа/);
    });

    it('should return start time for not started tour', () => {
      const tour = createMockTour({
        status: FantasyTourStatus.NotStarted,
        startedAt: '2024-08-17T10:00:00Z',
      });

      const result = TourService.formatStatus(tour);

      expect(result).toMatch(/стартует/);
    });

    it('should return undefined for unknown status', () => {
      const tour = createMockTour({
        status: 'UNKNOWN_STATUS' as unknown as FantasyTourStatus,
      });

      const result = TourService.formatStatus(tour);

      expect(result).toBeUndefined();
    });
  });
});
