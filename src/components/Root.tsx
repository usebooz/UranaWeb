import { App } from '@/components/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function ErrorBoundaryError({ error }: Readonly<{ error: unknown }>) {
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = JSON.stringify(error);
  }

  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>{errorMessage}</code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <App />
    </ErrorBoundary>
  );
}
