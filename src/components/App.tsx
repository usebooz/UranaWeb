import { useMemo } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import {
  retrieveLaunchParams,
  useSignal,
  isMiniAppDark,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { DebugRoute, FantasyRoute } from './Route';

/**
 * Main application component that sets up routing and theming.
 * Handles dark/light theme switching based on Telegram app settings
 * and configures appropriate platform styling for iOS/macOS vs other platforms.
 *
 * @returns The main application with routing and theme configuration
 */
export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <Routes>
          <Route path="/debug/*" Component={DebugRoute} />
          <Route path="/fantasy/*" Component={FantasyRoute} />
          <Route path="*" element={<Navigate to="/fantasy" />} />
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}
