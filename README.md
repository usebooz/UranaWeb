# UranawWeb - Telegram Mini App

Modern Telegram Mini App для работы с фэнтези турнирами от Sports.ru через GraphQL API.

## 🚀 Технологии

### Frontend Stack
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [@telegram-apps SDK](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
- [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI)
- [Vite 7](https://vitejs.dev/) + [SWC](https://swc.rs/)
- [React Router DOM 7](https://reactrouter.com/)

### GraphQL & Data Management
- [Apollo Client v3](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) с TypeScript client preset
- Sports.ru GraphQL API интеграция
- Fragment masking для type safety

### Code Quality & Development
- [ESLint](https://eslint.org/) с flat config и строгими правилами
- [Prettier](https://prettier.io/) для форматирования
- [clsx](https://github.com/lukeed/clsx) + [bem-cn](https://github.com/albburtsev/bem-cn) для CSS utilities
- Полная TypeScript типизация

## 🏗 Архитектура

Проект использует **Services Pattern** с разделением на слои:

```
src/
├── hooks/                    # React hooks для API
│   ├── useSportsru.ts       # Базовый хук с Apollo Client
│   ├── fantasy/             # Fantasy Sports hooks
│   └── other/               # Заготовка для других API
├── services/                # Бизнес-логика и утилиты
├── components/              # UI компоненты
├── gql/                     # GraphQL queries и сгенерированные типы
│   ├── queries/
│   └── generated/
├── pages/                   # Страницы приложения
└── navigation/              # Роутинг
```

### Ключевые особенности архитектуры

- **Инкапсуляция API**: Apollo Client скрыт внутри хуков
- **Type Safety**: Полная типизация от GraphQL схемы до UI
- **Services Layer**: Бизнес-логика отделена от компонентов
- **Модульность**: Готов к добавлению новых API
- **Alias Imports**: Использование `@/` для внутренних модулей

## � Описание проекта

UranawWeb - современное веб-приложение для работы с фэнтези турнирами:

- 🏆 Информация о турнирах РПЛ
- 📊 Статистика и аналитика
- ⚽ Данные об игроках и командах
- 🔄 Real-time обновления через GraphQL

## 🛠 Установка

```bash
git clone https://github.com/usebooz/UranaWeb.git
cd UranaWeb
npm install
```

### Настройка окружения

Создайте `.env` файл:

```bash
cp .env.example .env
```

Настройте переменные окружения:

```env
# Обязательно - GraphQL API endpoint
VITE_SPORTS_API_URL=sports_api_url

# Опционально - параметры турнира
VITE_SPORTS_TOURNAMENT_RPL=sports_tournament_rpl
```

## 🎯 Доступные скрипты

### Разработка
- `npm run dev` - Запуск в режиме разработки
- `npm run dev:https` - Запуск с HTTPS (для Telegram)

### GraphQL
- `npm run codegen` - Генерация TypeScript типов из GraphQL схемы
- `npm run codegen:watch` - Watch режим для кодогенерации

### Качество кода
- `npm run lint` - Проверка ESLint (0 warnings policy)
- `npm run lint:fix` - Автоисправление ESLint
- `npm run format` - Форматирование Prettier
- `npm run format:check` - Проверка форматирования

### Сборка и деплой
- `npm run build` - Production сборка
- `npm run preview` - Предпросмотр production сборки
- `npm run deploy` - Деплой на GitHub Pages

## 🔧 Разработка

### Локальный запуск

Для разработки рекомендуется использовать HTTPS:

```bash
npm run dev:https
```

После запуска откройте: `https://localhost:5173/UranaWeb/`

### Важные особенности

- **Mock Environment**: `src/mockEnv.ts` симулирует Telegram окружение
- **Type Safety**: Полная типизация от GraphQL до UI
- **Hot Reload**: Мгновенные обновления при разработке
- **Environment Variables**: Проверка обязательных переменных при запуске

### GraphQL разработка

1. Обновите схему: поместите новую схему в `schemas/sports-ru.json`
2. Добавьте queries в `src/gql/queries/`
3. Запустите кодогенерацию: `npm run codegen`
4. Создайте хуки в `src/hooks/fantasy/`
5. Добавьте бизнес-логику в `src/services/`

## 🚀 Деплой

### GitHub Pages (Автоматический)

Проект автоматически деплоится при push в `main`:

- URL: <https://usebooz.github.io/UranaWeb>
- Конфигурация: [`.github/workflows/github-pages-deploy.yml`](.github/workflows/github-pages-deploy.yml)

### Ручной деплой

```bash
npm run build
npm run deploy
```

### Настройка для форка

1. Измените `homepage` в `package.json`
2. Обновите `base` в `vite.config.ts`
3. Настройте GitHub Pages в настройках репозитория

## 📐 Стандарты кода

### ESLint конфигурация

- **Zero warnings policy** - любые предупреждения блокируют CI
- **Flat config** - современная конфигурация ESLint 9+
- **TypeScript strict mode** - максимальная типизация
- **React 19 rules** - правила для новой версии React

### Импорты

```typescript
// Внешние библиотеки
import { useQuery } from '@apollo/client';

// Внутренние модули (через @ алиас, без расширений)
import { useTournament } from '@/hooks/fantasy';
import { TournamentService } from '@/services';
```

### Архитектурные принципы

- **Services Pattern**: бизнес-логика в services, UI в components
- **Hook-first**: Apollo Client инкапсулирован в хуках
- **Type-driven**: типы определяют контракты между слоями
- **Модульность**: готовность к добавлению новых API

## 🧪 Тестирование

```bash
# В разработке
npm run test
npm run test:watch
npm run test:coverage
```

## 📚 Полезные ссылки

- [Telegram Mini Apps Platform](https://docs.telegram-mini-apps.com/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Sports.ru GraphQL Playground](https://www.sports.ru/gql/graphql/)
- [UranaBot Repository](https://github.com/usebooz/UranaBot)

## 📄 Лицензия

MIT
