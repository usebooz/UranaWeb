/**
 * Test setup file for Vitest
 * Configures the global test environment for all tests
 */

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SPORTS_API_URL: 'https://test-api.sports.ru/gql/graphql/',
    VITE_SPORTS_TOURNAMENT_RPL: 'rpl-2024-2025',
  },
  writable: true,
});

// Global test utilities can be added here
