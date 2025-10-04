import { Placeholder, AppRoot } from '@telegram-apps/telegram-ui';
import {
  retrieveLaunchParams,
  isColorDark,
  isRGB,
} from '@telegram-apps/sdk-react';
import { useMemo } from 'react';
import type { FC } from 'react';

/**
 * Props for ErrorPage component.
 */
interface ErrorPageProps {
  /** The error to display */
  error: unknown;
}

/**
 * Universal error page component based on Telegram UI Placeholder.
 * Used for all types of errors: platform checks, environment variables, data loading, "not found" etc.
 * Automatically detects platform and theme settings to provide consistent UI experience.
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
      // Fallback to default values if launch params are not available
      return ['android', false];
    }
  }, []);

  // Convert error to displayable string message
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
      <Placeholder header="Упс" description={errorMessage}>
        <img
          alt="Telegram sticker"
          src="https://xelene.me/telegram.gif"
          style={{ display: 'block', width: '144px', height: '144px' }}
        />
      </Placeholder>
    </AppRoot>
  );
};
