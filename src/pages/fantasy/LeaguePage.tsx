import { useParams, useSearchParams } from 'react-router-dom';
import {
  Accordion,
  Badge,
  Divider,
  Info,
  List,
  Pagination,
  Section,
  Select,
} from '@telegram-apps/telegram-ui';
import { useEffect, type FC } from 'react';

import { Page } from '@/components/Page/Page';
import { LoadingPage } from '@/components/Page/LoadingPage';
import { ErrorPage } from '@/components/Page/ErrorPage';
import { useLeagueById, useTourById } from '@/hooks/useFantasy';
import { FantasyService } from '@/services/fantasy.service';
import { FantasyTourStatus } from '@/gql/generated/graphql';

export const LeaguePage: FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Загружаем данные лиги
  const {
    data: league,
    loading: leagueLoading,
    error: leagueError,
  } = useLeagueById(leagueId!, {
    skip: !leagueId,
  });

  // 2. Определяем tourId из URL или вычисляем автоматически
  const tourId =
    searchParams.get('tourId') || FantasyService.getCurrentTourId(league);

  // 3. Загружаем данные тура
  const {
    data: tour,
    loading: tourLoading,
    error: tourError,
  } = useTourById(tourId!, {
    skip: !tourId,
  });

  // 4. Устанавливаем tourId в URL если его там не было
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (!tourId || newSearchParams.has('tourId')) {
      return;
    }
    newSearchParams.set('tourId', tourId);
    setSearchParams(newSearchParams);
  }, [tourId, searchParams, setSearchParams]);

  // Обработчик изменения тура в пагинации
  const handleTourChange = (_event: unknown, page: number): void => {
    if (!league?.season?.tours) return;

    const availableTours = league.season.tours.filter(
      t =>
        t.status === FantasyTourStatus.Finished ||
        t.status === FantasyTourStatus.InProgress
    );
    const selectedTour = availableTours[page - 1];

    if (selectedTour) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tourId', selectedTour.id);
      setSearchParams(newSearchParams);
    }
  };

  if (leagueLoading || tourLoading) {
    return <LoadingPage />;
  }

  // Показываем ErrorPage если ошибка загрузки лиги или нет данных
  if (leagueError || !league) {
    return <ErrorPage error={leagueError || new Error('League not found')} />;
  }

  // Показываем ErrorPage если ошибка загрузки тура или нет данных
  if (tourError || !tour) {
    return <ErrorPage error={tourError || new Error('Tour not found')} />;
  }

  // Вычисляем данные для отображения
  const finishedToursCount = FantasyService.getFinishedToursCount(league);
  const availableToursCount = FantasyService.getAvailableToursCount(league);
  const currentTourNumber = FantasyService.getTourNumber(tour);
  const tourStatusHint = FantasyService.getTourStatusHint(tour.status);
  const shouldShowBadge = FantasyService.shouldShowTourBadge(tour.status);
  const playedMatchesCount = FantasyService.getPlayedMatchesCount(tour);

  return (
    <Page back={false}>
      <List>
        <Section>
          <Select header="Лига" disabled>
            <option>{league.name}</option>
          </Select>
        </Section>
        <Section header={`Туров завершено: ${finishedToursCount}`}>
          <Pagination
            hideNextButton
            hidePrevButton
            boundaryCount={1}
            count={availableToursCount}
            siblingCount={1}
            page={currentTourNumber}
            onChange={handleTourChange}
          />
          <Accordion expanded={false} onChange={() => {}}>
            <Accordion.Summary
              hint={tourStatusHint}
              titleBadge={shouldShowBadge ? <Badge type="dot" /> : undefined}
              subtitle={`Сыграно матчей: ${playedMatchesCount}`}
              interactiveAnimation="opacity"
              after={
                <Info type="text" subtitle="В среднем">
                  27.5
                </Info>
              }
            >
              {tour.name}
            </Accordion.Summary>
          </Accordion>
        </Section>
        <Section
          header={<Section.Header>Команд участвует: {15}</Section.Header>}
        >
          <Divider />
          <Accordion expanded={false} onChange={() => {}}>
            <Accordion.Summary
              titleBadge={<Badge type="number">10%</Badge>}
              subhead="@user_dummy_user"
              subtitle="Сыграло в туре: 4/11"
              description="/"
              before={
                <Info type="text" subtitle="+1" className="cell">
                  1
                </Info>
              }
              after={
                <Info type="text" subtitle="73">
                  299
                </Info>
              }
            >
              Бледные перспективы
            </Accordion.Summary>
          </Accordion>
          <Accordion expanded={false} onChange={() => {}}>
            <Accordion.Summary
              titleBadge={<Badge type="number">10%</Badge>}
              subhead="@user_dummy_user"
              subtitle="Сыграло 4/11 игроков"
              description="/"
              before={
                <Info type="text" subtitle="+1" className="cell">
                  1
                </Info>
              }
              after={
                <Info type="text" subtitle="73">
                  299
                </Info>
              }
            >
              Бледные перспективы
            </Accordion.Summary>
          </Accordion>
        </Section>
      </List>
    </Page>
  );
};
