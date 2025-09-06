# React Hooks Documentation

Документация по React хукам для работы с GraphQL API в проекте.

## Структура хуков

### `useLeague.ts` - Хуки для работы с лигами

- `useLeagueById(id, options?)` - Получение лиги по ID
- `useLeagueSquadsWithTourRating(leagueId, tourId, options?)` - Получение составов лиги с рейтингом по туру
- `useLeagueSquadsWithSeasonRating(leagueId, seasonId, options?)` - Получение составов лиги с рейтингом по сезону
- `useLeagueSquadsCurrentTourInfo(leagueId, seasonId, options?)` - Получение информации о составах лиги на текущий тур

### `useTour.ts` - Хуки для работы с турами

- `useTourById(id, options?)` - Получение тура по ID
- `useTourMatches(id, options?)` - Получение матчей тура

### `useSquad.ts` - Хуки для работы с составами

- `useLeagueSquadTourInfo(tourId, squadId, options?)` - Получение информации о составе на определенный тур

### `useSports.ts` - Базовый хук для GraphQL запросов

- `useSportsQuery(document, options?)` - Базовый хук для выполнения GraphQL запросов через Apollo Client

## Использование

```typescript
import { useLeagueById, useLeagueSquadsWithTourRating } from '@/hooks/useLeague';
import { useTourById, useTourMatches } from '@/hooks/useTour';
import { useLeagueSquadTourInfo } from '@/hooks/useSquad';

// Пример использования в компоненте
const MyComponent = () => {
  const { data: league, loading } = useLeagueById('league-id');
  const { data: tour } = useTourById('tour-id');
  const { data: matches } = useTourMatches('tour-id');
  
  // ...
};
```

## Архитектурные принципы

1. **Разделение ответственности** - каждый файл содержит хуки для работы с определенной сущностью
2. **Типизация** - все хуки полностью типизированы с использованием TypeScript
3. **Переиспользование** - базовый хук `useSportsQuery` используется всеми остальными хуками
4. **Консистентность** - все хуки следуют одинаковому паттерну API
