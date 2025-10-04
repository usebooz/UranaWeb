import { Route, Routes } from 'react-router-dom';

import {
  IndexPage,
  InitDataPage,
  ThemeParamsPage,
  LaunchParamsPage,
} from '@/pages/debug';

/**
 * Debug route component that provides routing for debugging and development tools.
 * Includes pages for inspecting Telegram Mini App data, theme parameters, and launch parameters.
 * Used for development and troubleshooting Telegram Web App integration.
 *
 * @returns Debug routes for development tools
 */
export function DebugRoute() {
  return (
    <Routes>
      <Route path="/" Component={IndexPage} />
      <Route path="/init-data" Component={InitDataPage} />
      <Route path="/theme-params" Component={ThemeParamsPage} />
      <Route path="/launch-params" Component={LaunchParamsPage} />
    </Routes>
  );
}
