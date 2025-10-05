/**
 * Test setup file for Vitest
 * Configures the global test environment for all tests
 */

// Mock Vite environment variables properly
// This needs to be done before any imports that use import.meta.env
import { vi } from 'vitest';

// Mock import.meta.env for Vite
vi.stubGlobal('__vite_import_meta_env__', {
  VITE_SPORTS_API_URL: 'https://test-api.sports.ru/gql/graphql/',
  VITE_SPORTS_TOURNAMENT_RPL: 'rpl-2024-2025',
});

// Also set up import.meta.env directly
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SPORTS_API_URL: 'https://test-api.sports.ru/gql/graphql/',
    VITE_SPORTS_TOURNAMENT_RPL: 'rpl-2024-2025',
  },
  configurable: true,
});

// Global test utilities can be added here
