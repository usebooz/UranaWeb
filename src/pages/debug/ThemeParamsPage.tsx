import { themeParams, useSignal } from '@telegram-apps/sdk-react';
import type { FC } from 'react';
import { List } from '@telegram-apps/telegram-ui';

import { DisplayData } from '@/components/DisplayData';
import { Page } from '@/components/Page';

/**
 * Debug page component for displaying Telegram Web App theme parameters.
 * Shows current theme colors and styling parameters from Telegram.
 * Converts camelCase parameter names to snake_case for better readability.
 * Used for debugging theme integration and styling.
 *
 * @returns {JSX.Element} The rendered theme parameters debug page
 */
export const ThemeParamsPage: FC = () => {
  const tp = useSignal(themeParams.state);

  return (
    <Page>
      <List>
        <DisplayData
          rows={Object.entries(tp).map(([title, value]) => ({
            title: title
              .replace(/[A-Z]/g, m => `_${m.toLowerCase()}`)
              .replace(/background/, 'bg'),
            value,
          }))}
        />
      </List>
    </Page>
  );
};
