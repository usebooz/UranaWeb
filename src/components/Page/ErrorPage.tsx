import { Placeholder, AppRoot } from '@telegram-apps/telegram-ui';
import {
  retrieveLaunchParams,
  isColorDark,
  isRGB,
} from '@telegram-apps/sdk-react';
import { useMemo } from 'react';
import type { FC } from 'react';

interface ErrorPageProps {
  error: unknown;
}

/**
 * Универсальная страница ошибки на основе Telegram UI Placeholder
 * Используется для всех ошибок: проверка платформы, переменные окружения, загрузка данных, "не найдено"
 */
export const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  const [platform, isDark] = useMemo(() => {
    try {
      const lp = retrieveLaunchParams();
      const { bg_color: bgColor } = lp.tgWebAppThemeParams;
      return [
        lp.tgWebAppPlatform,
        bgColor && isRGB(bgColor) ? isColorDark(bgColor) : false,
      ];
    } catch {
      return ['android', false];
    }
  }, []);

  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = JSON.stringify(error);
  }

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(platform) ? 'ios' : 'base'}
    >
      <Placeholder header="Oops" description={errorMessage}>
        <img
          alt="Telegram sticker"
          src="https://xelene.me/telegram.gif"
          style={{ display: 'block', width: '144px', height: '144px' }}
        />
      </Placeholder>
    </AppRoot>
  );
};
