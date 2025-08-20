/**
 * Централизованный экспорт для GraphQL модуля
 * Объединяет запросы, типы и утилиты
 */

import {
  GetLeagueQuery,
  GetLeagueSquadsQuery,
  GetTourQuery,
} from './generated/graphql.js';

// Экспорт всех запросов
export * from './queries';

// Экспорт сгенерированных типов и утилит
export * from './generated';

export type League = GetLeagueQuery['fantasyQueries']['league'];
export type LeagueSquads = NonNullable<
  GetLeagueSquadsQuery['fantasyQueries']['rating']['squads']
>['list'];
export type Tour = GetTourQuery['fantasyQueries']['tour'];

// Экспорт конкретных типов для удобства
export type {} from './generated/graphql.js';

export { FantasyIdSource } from './generated/graphql.js';
