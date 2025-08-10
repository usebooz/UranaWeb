import { App } from '@/components/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/Page/ErrorPage';

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
