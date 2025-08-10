// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root';
import { EnvUnsupported } from '@/components/EnvUnsupported';
import { init } from '@/init';

import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

// Проверяем наличие обязательных переменных окружения
if (!import.meta.env.VITE_SPORTS_API_URL) {
  console.error('❌ VITE_SPORTS_API_URL environment variable is required');
  throw new Error('VITE_SPORTS_API_URL environment variable is required');
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug =
    (launchParams.tgWebAppStartParam || '').includes('platformer_debug') ||
    import.meta.env.DEV;

  // Configure all application dependencies.
  init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  });

  root.render(
    <StrictMode>
      <Root />
    </StrictMode>
  );
} catch {
  root.render(<EnvUnsupported />);
}
