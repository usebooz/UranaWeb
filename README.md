# UranaWeb - Telegram Mini App

Modern Telegram Mini App for fantasy football tournaments from Sports.ru via GraphQL API.

## 🚀 Technology Stack

### Frontend Framework

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [@telegram-apps SDK](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
- [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI)
- [Vite 7](https://vitejs.dev/) + [SWC](https://swc.rs/)
- [React Router DOM 7](https://reactrouter.com/)

### GraphQL & Data Management

- [Apollo Client v4](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) with TypeScript client preset
- Sports.ru GraphQL API integration
- Fragment masking for type safety

### Code Quality & Development

- [ESLint](https://eslint.org/) with flat config and strict rules
- [Prettier](https://prettier.io/) for code formatting
- [clsx](https://github.com/lukeed/clsx) + [bem-cn](https://github.com/albburtsev/bem-cn) for CSS utilities
- Full TypeScript typification with strict mode
- [npm](https://www.npmjs.com/) package manager

## 🏗 Architecture

The project uses **Services Pattern** with layer separation:

```text
src/
├── hooks/                   # React hooks for API integration
├── services/                # Business logic and utilities (modular architecture)
├── components/              # UI components with full JSDoc documentation
├── gql/                     # GraphQL queries and generated types
│   ├── queries/
│   ├── generated/
│   └── client.ts           # Apollo Client configuration
├── pages/                   # Application pages
├── types/                   # Global types and extensions
└── navigation/              # Routing configuration
```

### Key Architecture Features

- **Modular Services**: Separation by Single Responsibility Principle
- **API Encapsulation**: Apollo Client hidden inside hooks
- **Type Safety**: Complete typification from GraphQL schema to UI
- **Services Layer**: Business logic separated from components
- **Modularity**: Ready for adding new APIs
- **Alias Imports**: Using `@/` for internal modules
- **Cache Management**: Custom Apollo Client cache policies for real-time updates

## 📱 Project Description

UranaWeb is a modern web application for fantasy football tournaments:

- 🏆 Russian Premier League tournament information
- 📊 Statistics and analytics
- ⚽ Player and team data
- 🔄 Real-time updates via GraphQL
- 👥 League management and squad analysis
- 📈 Live scoring and player performance tracking

## 🛠 Installation

```bash
git clone https://github.com/usebooz/UranaWeb.git
cd UranaWeb
npm install
```

### Environment Setup

Create `.env` file:

```bash
cp .env.example .env
```

Configure environment variables:

```env
# Required - GraphQL API endpoint
VITE_URANA_API_URL=urana_api_url

# Optional - tournament parameters
VITE_SPORTS_TOURNAMENT_RPL=sports_tournament_rpl
```

## 🎯 Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run dev:https` - Start with HTTPS (for Telegram)

### GraphQL

- `npm run codegen` - Generate TypeScript types from GraphQL schema
- `npm run codegen:watch` - Watch mode for code generation

### Code Quality

- `npm run lint` - ESLint check (zero warnings policy)
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Prettier formatting
- `npm run format:check` - Check formatting

### Build and Deploy

- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 🔧 Development

### Local Development

For development, HTTPS is recommended:

```bash
npm run dev:https
```

After starting, open: `https://localhost:5173/UranaWeb/`

### Important Features

- **Mock Environment**: `src/mockEnv.ts` simulates Telegram environment
- **Type Safety**: Complete typification from GraphQL to UI
- **Hot Reload**: Instant updates during development
- **Environment Variables**: Validation of required variables on startup

### GraphQL Development

1. Update schema: place new schema in `schemas/sports.json`
2. Add queries in `src/gql/queries/`
3. Run code generation: `npm run codegen`
4. Create hooks in appropriate hook files
5. Add business logic to corresponding services:
   - `LeagueService` - league and season management
   - `TourService` - tour operations
   - `MatchService` - match operations
   - `SquadService` - teams and ratings
   - `PlayerService` - players and statistics

### Service Architecture Principles

- **Single Responsibility**: each service handles its domain
- **Static Methods**: all methods are static for simplicity
- **Type Safety**: strict typing of input and output data
- **No Side Effects**: services don't modify global state
- **Composition**: services can use each other

## 🚀 Deployment

### GitHub Pages (Automatic)

The project automatically deploys on push to `main`:

- URL: <https://usebooz.github.io/UranaWeb>
- Configuration: [`.github/workflows/github-pages-deploy.yml`](.github/workflows/github-pages-deploy.yml)

### Manual Deploy

```bash
npm run build
npm run deploy
```

### Fork Configuration

1. Change `homepage` in `package.json`
2. Update `base` in `vite.config.ts`
3. Configure GitHub Pages in repository settings

## 📐 Code Standards

### ESLint Configuration

- **Zero warnings policy** - any warnings block CI
- **Flat config** - modern ESLint 9+ configuration
- **TypeScript strict mode** - maximum typification
- **React 19 rules** - rules for the new React version

### Import Standards

```typescript
// External libraries
import { useQuery } from '@apollo/client';

// Internal modules (via @ alias, without extensions)
import { useTournament } from '@/hooks/useTournament';
import { TournamentService } from '@/services';
```

### Documentation Standards

- **Complete JSDoc**: All components, services, and hooks have comprehensive documentation in English
- **Type Documentation**: All parameters and return values documented
- **Business Logic**: Complex algorithms and fantasy football rules explained
- **API Integration**: GraphQL operations and cache policies documented

### Architecture Principles

- **Modular Services**: business logic separation by domains
- **Hook-first**: Apollo Client encapsulated in hooks
- **Type-driven**: types define contracts between layers
- **Single Responsibility**: each service has clearly defined responsibilities
- **Modularity**: ready for adding new APIs

## 🧪 Testing

```bash
# In development
npm run test
npm run test:watch
npm run test:coverage
```

## 📚 Useful Links

- [Telegram Mini Apps Platform](https://docs.telegram-mini-apps.com/)
- [Apollo Client v4 Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Sports.ru GraphQL Playground](https://www.sports.ru/gql/graphql/)
- [UranaBot Repository](https://github.com/usebooz/UranaBot)
- [React 19 Documentation](https://react.dev/)
- [npm Documentation](https://docs.npmjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the established code standards
- Add JSDoc documentation for new components/services
- Ensure zero ESLint warnings
- Update tests for new functionality
- Use TypeScript strict mode

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Note**: This project is part of the UranaBot ecosystem for fantasy football tournament management via Telegram.
