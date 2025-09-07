import { App, ErrorBoundary } from '@/components';
import { ErrorPage } from '@/components/Page';

export function Root() {
  return (
    <ErrorBoundary
      fallback={({ error }) => {
        return <ErrorPage error={error} />;
      }}
    >
      <App />
    </ErrorBoundary>
  );
}
