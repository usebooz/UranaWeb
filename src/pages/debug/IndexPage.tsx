import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link';
import { Page } from '@/components/Page';

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
