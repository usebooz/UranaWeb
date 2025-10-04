import { App, ErrorBoundary } from '@/components';

export function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
