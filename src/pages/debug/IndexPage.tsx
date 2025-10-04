import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link';
import { Page } from '@/components/Page';

/**
 * Debug index page component that provides navigation to various debug tools.
 * Serves as a landing page for developers to access Telegram Mini App debugging features.
 * Includes links to init data, launch parameters, and theme parameters inspection.
 *
 * @returns Debug navigation page with links to debugging tools
 */
export const IndexPage: FC = () => {
  return (
    <Page back={false}>
      <List>
        <Section
          header="Debug Information"
          footer="Technical pages for developers to inspect Telegram Mini App data"
        >
          <Link to="/debug/init-data">
            <Cell subtitle="User data, chat information, technical data">
              Init Data
            </Cell>
          </Link>
          <Link to="/debug/launch-params">
            <Cell subtitle="Platform identifier, Mini Apps version, etc.">
              Launch Parameters
            </Cell>
          </Link>
          <Link to="/debug/theme-params">
            <Cell subtitle="Telegram application palette information">
              Theme Parameters
            </Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};
