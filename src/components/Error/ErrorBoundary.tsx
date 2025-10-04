import {
  Component,
  type GetDerivedStateFromError,
  type PropsWithChildren,
} from 'react';
import { ErrorPage } from './ErrorPage';

interface ErrorBoundaryState {
  error?: unknown;
}

export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {};

  static readonly getDerivedStateFromError: GetDerivedStateFromError<
    PropsWithChildren,
    ErrorBoundaryState
  > = error => ({ error });

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    const {
      state: { error },
      props: { children },
    } = this;

    return 'error' in this.state ? <ErrorPage error={error} /> : children;
  }
}
