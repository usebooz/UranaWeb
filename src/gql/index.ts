/**
 * Централизованный экспорт для GraphQL модуля
 * Объединяет запросы, типы и утилиты
 */

import {
  GetLeagueQuery,
  GetLeagueSquadsQuery,
  GetLeagueSquadsWithCurrentTourInfoQuery,
  GetSquadTourInfoQuery,
  GetTourMatchesQuery,
  GetTournamentQuery,
  GetTourQuery,
} from './generated/graphql.js';

// Экспорт сгенерированных типов и утилит
export * from './generated';

export type Tournament = NonNullable<
  GetTournamentQuery['fantasyQueries']['tournament']
>;

export type League = NonNullable<GetLeagueQuery['fantasyQueries']['league']>;

export type LeagueSquad = NonNullable<
  GetLeagueSquadsQuery['fantasyQueries']['rating']['squads']
>['list'][0];
export type LeagueSquadWithCurrentTourInfo = NonNullable<
  GetLeagueSquadsWithCurrentTourInfoQuery['fantasyQueries']['rating']['squads']
>['list'][0];

export type SquadTourInfo =
  GetSquadTourInfoQuery['fantasyQueries']['squadTourInfo'];
export type SquadTourPlayer = NonNullable<SquadTourInfo>['players'][0];

export type Tour = NonNullable<GetTourQuery['fantasyQueries']['tour']>;

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
