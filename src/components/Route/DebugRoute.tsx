import { Route, Routes } from 'react-router-dom';

import {
  IndexPage,
  InitDataPage,
  ThemeParamsPage,
  LaunchParamsPage,
} from '@/pages/debug';

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
