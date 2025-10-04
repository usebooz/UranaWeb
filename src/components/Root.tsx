import { App, ErrorBoundary } from '@/components';

/**
 * Root component that wraps the entire application with error boundary.
 * Provides global error handling for the application tree.
 *
 * @returns The root application component wrapped in error boundary
 */
export function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
