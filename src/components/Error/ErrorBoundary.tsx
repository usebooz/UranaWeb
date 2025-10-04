import {
  Component,
  type GetDerivedStateFromError,
  type PropsWithChildren,
} from 'react';
import { ErrorPage } from './ErrorPage';

/**
 * State interface for ErrorBoundary component.
 */
interface ErrorBoundaryState {
  /** The error that was caught, if any */
  error?: unknown;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree.
 * When an error is caught, it displays the ErrorPage component instead of the crashed component tree.
 * This prevents the entire application from crashing due to unhandled errors in components.
 */
export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  /** Initial state with no error */
  state: ErrorBoundaryState = {};

  /**
   * Static lifecycle method that updates state when an error is caught.
   * This enables the component to render a fallback UI after an error has been thrown.
   */
  static readonly getDerivedStateFromError: GetDerivedStateFromError<
    PropsWithChildren,
    ErrorBoundaryState
  > = error => ({ error });

  /**
   * Lifecycle method called when an error is caught by this boundary.
   * Used for error reporting and updating component state.
   *
   * @param error - The error that was thrown
   */
  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  /**
   * Renders either the error page or the children components.
   *
   * @returns ErrorPage if there's an error, otherwise the children
   */
  render() {
    const {
      state: { error },
      props: { children },
    } = this;

    return 'error' in this.state ? <ErrorPage error={error} /> : children;
  }
}
