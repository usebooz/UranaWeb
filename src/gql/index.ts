/**
 * Централизованный экспорт для GraphQL модуля
 * Объединяет запросы, типы и утилиты
 */

import {
  GetLeagueQuery,
  GetLeagueSquadsQuery,
  GetSquadTourInfoQuery,
  GetTourMatchesQuery,
  GetTourQuery,
  Scalars,
} from './generated/graphql.js';

// Экспорт сгенерированных типов и утилит
export * from './generated';

export type League = GetLeagueQuery['fantasyQueries']['league'];

export type LeagueSquad = NonNullable<
  GetLeagueSquadsQuery['fantasyQueries']['rating']['squads']
>['list'][0];

export type SquadTourInfo = {
  id: Scalars['ID']['input'];
  tourInfo: GetSquadTourInfoQuery['fantasyQueries']['squadTourInfo'];
};
export type SquadTourPlayer = NonNullable<
  SquadTourInfo['tourInfo']
>['players'][0];

export type Tour = GetTourQuery['fantasyQueries']['tour'];

export type TourMatch = NonNullable<
  GetTourMatchesQuery['fantasyQueries']['tour']
>['matches'][0];

export enum MatchLineupPlayerStatus {
  Starting = 'STARTING',
  Substituted = 'SUBSTITUTED',
  NotInLineup = 'NOT_IN_LINEUP',
}

// Экспорт конкретных типов для удобства
export type {} from './generated/graphql.js';

export { FantasyIdSource } from './generated/graphql.js';
