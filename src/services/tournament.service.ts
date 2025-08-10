import type { TournamentQuery } from '@/gql/generated/graphql';

// Type alias для удобства
type Tournament = NonNullable<TournamentQuery['fantasyQueries']['tournament']>;

/**
 * Сервис для работы с данными турниров
 * Содержит бизнес-логику обработки данных от Sports.ru API
 */
export class TournamentService {
  /**
   * Получает информацию о текущем сезоне
   */
  static getCurrentSeasonInfo(tournament: Tournament): {
    name: string;
    year: string | null;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
  } | null {
    const season = tournament.currentSeason;
    if (!season?.statObject) return null;

    return {
      name: season.statObject.name || 'Сезон',
      year: season.statObject.year || null,
      startDate: season.statObject.startDate || null,
      endDate: season.statObject.endDate || null,
      isActive: season.isActive,
    };
  }
}
