/**
 * Централизованный экспорт для GraphQL модуля
 * Объединяет запросы, типы и утилиты
 */

import {
  GetLeagueQuery,
  GetLeagueSquadsCurrentTourInfoQuery,
  GetLeagueSquadsQuery,
  GetTourMatchesQuery,
  GetTourQuery,
} from './generated/graphql.js';

// Экспорт сгенерированных типов и утилит
export * from './generated';

export type League = GetLeagueQuery['fantasyQueries']['league'];
export type LeagueSquad = NonNullable<
  GetLeagueSquadsQuery['fantasyQueries']['rating']['squads']
>['list'][0];
export type LeagueSquadCurrentTourInfo = NonNullable<
  GetLeagueSquadsCurrentTourInfoQuery['fantasyQueries']['rating']['squads']
>['list'][0];
export type Tour = GetTourQuery['fantasyQueries']['tour'];
export type TourMatch = NonNullable<
  GetTourMatchesQuery['fantasyQueries']['tour']
>['matches'][0];
export type SquadTourPlayer = NonNullable<
  LeagueSquadCurrentTourInfo['squad']['currentTourInfo']
>['players'][0];

// Экспорт конкретных типов для удобства
export type {} from './generated/graphql.js';

export { FantasyIdSource } from './generated/graphql.js';
