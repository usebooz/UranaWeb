/**
 * Main application entry point for UranaWeb Telegram Web App.
 * Handles application initialization, environment setup, and error boundaries.
 *
 * Features:
 * - Telegram SDK initialization with platform-specific configuration
 * - Debug mode detection and Eruda integration for mobile debugging
 * - Global error handling with fallback error page
 * - Environment mocking for development outside Telegram
 */

// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root';
import { ErrorPage } from '@/components/Error/ErrorPage.tsx';
import { init } from '@/init';

import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

// Get the root DOM element for React app mounting
const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  // Retrieve Telegram Web App launch parameters
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;

  // Enable debug mode for development or when debug parameter is present
  const debug =
    (launchParams.tgWebAppStartParam || '').includes('platformer_debug') ||
    import.meta.env.DEV;

  // Configure all application dependencies with platform-specific settings
  init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform), // Mobile debugging tool
    mockForMacOS: platform === 'macos', // macOS-specific fixes
  });

  // Render the main application with React StrictMode
  root.render(
    <StrictMode>
      <Root />
    </StrictMode>
  );
} catch (error) {
  // Fallback error page for initialization failures
  root.render(<ErrorPage error={error} />);
}
