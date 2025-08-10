import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/debug/IndexPage';
import { InitDataPage } from '@/pages/debug/InitDataPage';
import { ThemeParamsPage } from '@/pages/debug/ThemeParamsPage';
import { LaunchParamsPage } from '@/pages/debug/LaunchParamsPage';
import { LeaguePage } from '@/pages/fantasy/LeaguePage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  // Корень направляет на debug IndexPage (временно, пока не сделаем продуктовые страницы)
  { path: '/', Component: IndexPage },

  // Продуктовые маршруты
  { path: '/league/:leagueId', Component: LeaguePage, title: 'Лига' },

  // Debug страницы для технической информации
  { path: '/debug', Component: IndexPage, title: 'Debug Info' },
  { path: '/debug/init-data', Component: InitDataPage, title: 'Init Data' },
  {
    path: '/debug/theme-params',
    Component: ThemeParamsPage,
    title: 'Theme Params',
  },
  {
    path: '/debug/launch-params',
    Component: LaunchParamsPage,
    title: 'Launch Params',
  },
];
