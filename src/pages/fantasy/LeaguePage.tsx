import { useParams } from 'react-router-dom';
import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Page } from '@/components/Page/Page';
import { LoadingPage } from '@/components/Page/LoadingPage';
import { useTournamentByWebname } from '@/hooks';
import { TournamentService } from '@/services';

export const LeaguePage: FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();

  // Используем хук для получения данных о турнире (лиге)
  const { data, loading, error } = useTournamentByWebname(
    leagueId || 'russia', // fallback на russia если нет ID
    {
      skip: !leagueId, // пропускаем запрос если нет ID
    }
  );

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    throw error;
  }

  const tournament = data?.fantasyQueries?.tournament;
  if (!tournament) {
    throw new Error(`Tournament with ID "${leagueId}" not found`);
  }

  // Используем сервис для обработки данных
  const seasonInfo = TournamentService.getCurrentSeasonInfo(tournament);

  return (
    <Page>
      <List>
        <Section header="s" footer="d">
          <Cell subtitle="ID лиги">{leagueId}</Cell>

          {seasonInfo && (
            <>
              <Cell subtitle="Сезон">{seasonInfo.name}</Cell>

              <Cell subtitle="Статус">
                {seasonInfo.isActive ? '🟢 Активный' : '🔴 Завершён'}
              </Cell>
            </>
          )}
        </Section>
      </List>
    </Page>
  );
};
