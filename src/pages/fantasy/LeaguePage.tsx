import { useParams, useSearchParams } from 'react-router-dom';
import {
  Accordion,
  Badge,
  Cell,
  Divider,
  Info,
  List,
  Pagination,
  Section,
  Select,
  Skeleton,
  Avatar,
} from '@telegram-apps/telegram-ui';
import { useEffect, useState, useMemo, type FC } from 'react';

import { Page } from '@/components/Page/Page';
import { LoadingPage } from '@/components/Page/LoadingPage';
import { ErrorPage } from '@/components/Page/ErrorPage';
import {
  useLeagueById,
  useTourById,
  useLeagueSquadsWithTourRating,
  useLeagueSquadsWithSeasonRating,
  useLeagueSquadsCurrentPlayers,
  useTourMatches,
} from '@/hooks/useFantasy';
import { FantasyService } from '@/services/fantasy.service';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';

export const LeaguePage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedSquads, setExpandedSquads] = useState<Set<string>>(new Set());
  const [isTourExpanded, setIsTourExpanded] = useState<boolean>(false);
  const [shouldLoadMatches, setShouldLoadMatches] = useState<boolean>(false);

  // League
  const { leagueId } = useParams<{ leagueId: string }>();
  const {
    data: league,
    loading: leagueLoading,
    error: leagueError,
  } = useLeagueById(leagueId!, {
    skip: !leagueId,
  });

  // Tour
  const tourId = searchParams.get('tourId');
  const {
    data: tour,
    loading: tourLoading,
    error: tourError,
  } = useTourById(tourId!, {
    skip: !tourId,
  });

  const seasonId = useMemo(
    () => FantasyService.getSeasonId(league),
    [league?.season?.id]
  );

  // Matches
  const isTourInProgress = useMemo(
    () => FantasyService.isTourInProgress(tour),
    [tour?.status]
  );

  // Логирование условий skip для matches
  const matchesSkip = !tourId || !shouldLoadMatches;

  const { data: matches, loading: matchesLoading } = useTourMatches(tourId!, {
    skip: matchesSkip,
    fetchPolicy: 'no-cache', // Полностью отключаем кеш для matches
  });

  // Squads
  const isTourOpened = useMemo(
    () => FantasyService.isTourOpened(tour),
    [tour?.status]
  );

  // Логирование условий skip для squads
  const seasonRatingSkip = !seasonId || !leagueId || !isTourOpened;
  const tourRatingSkip = !leagueId || !tourId || isTourOpened;

  const seasonRatingResult = useLeagueSquadsWithSeasonRating(
    leagueId!,
    seasonId!,
    {
      skip: seasonRatingSkip,
    }
  );
  const tourRatingResult = useLeagueSquadsWithTourRating(leagueId!, tourId!, {
    skip: tourRatingSkip,
  });
  const { data: squads, loading: squadsLoading } = isTourOpened
    ? seasonRatingResult
    : tourRatingResult;

  // Players
  const isTourCurrent = useMemo(
    () => FantasyService.isTourCurrent(league, tour),
    [league?.season?.currentTour?.id, tour?.id]
  );
  const { data: squadsPlayers, loading: playersLoading } =
    useLeagueSquadsCurrentPlayers(leagueId!, seasonId!, {
      skip: !leagueId || !seasonId || !isTourCurrent,
    });

  //Tour set
  useEffect(() => {
    if (tourId || !league) {
      return;
    }
    const currentTourId = FantasyService.getCurrentTourId(league);
    if (!currentTourId) {
      return;
    }
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tourId', currentTourId);
    setSearchParams(newSearchParams);
  }, [tourId, league, setSearchParams]); // Убрали searchParams из зависимостей

  //Tour init
  useEffect(() => {
    setExpandedSquads(new Set());
    setIsTourExpanded(false); // Сворачиваем аккордеон тура при смене
    setShouldLoadMatches(false); // Сбрасываем триггер загрузки матчей
  }, [tourId]);

  //Matches load
  useEffect(() => {
    if (isTourInProgress) {
      setShouldLoadMatches(true);
    }
  }, [isTourInProgress]);

  // Обработчик изменения состояния аккордеона
  const handleSquadExpand = (squadId: string, isExpanded: boolean) => {
    setExpandedSquads(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(squadId);
      } else {
        newSet.delete(squadId);
      }
      return newSet;
    });
  };

  const handleTourExpand = (isExpanded: boolean) => {
    setIsTourExpanded(isExpanded);
    // При первом разворачивании аккордеона загружаем матчи (если не IN_PROGRESS)
    if (isExpanded && !shouldLoadMatches) {
      setShouldLoadMatches(true);
    }
  };

  // Обработчик изменения тура в пагинации
  const handleTourChange = (_event: unknown, page: number): void => {
    const selectedTour = FantasyService.getTourByPage(league, page);

    if (selectedTour) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tourId', selectedTour.id);
      setSearchParams(newSearchParams);
    }
  };

  const availableToursCount = useMemo(
    () => FantasyService.getAvailableToursCount(league),
    [
      league?.id,
      league?.season.currentTour?.id,
      league?.season.currentTour?.status,
    ]
  );
  const toursHeader = useMemo(
    () => FantasyService.getToursHeader(league),
    [
      league?.id,
      league?.season.currentTour?.id,
      league?.season.currentTour?.status,
    ]
  );
  const currentTourNumber = useMemo(
    () => FantasyService.getTourNumber(tour),
    [tour?.name] // Изменено с tour?.id на tour?.name
  );
  const tourStatusHint = useMemo(
    () => FantasyService.getTourStatusHint(tour),
    [tour?.status] // Убрали tour?.id
  );
  const shouldShowTourBadge = useMemo(
    () => FantasyService.isTourInProgress(tour),
    [tour?.status] // Убрали tour?.id
  );
  const averageSubtitle = useMemo(
    () => FantasyService.getAverageSubtitle(tour),
    [tour?.status] // Убрали tour?.id
  );
  const squadsHeader = useMemo(
    () => FantasyService.getSquadsHeader(squads),
    [squads?.[0]?.scoreInfo.totalPlaces] // Убрали tour?.id
  );
  const tourSubtitle = useMemo(
    () => FantasyService.getTourSubtitle(tour, matches, squads),
    [tour?.status, tour?.startedAt, squads?.length, matches?.length] // Убрали tour?.id
  );

  const averageScore = useMemo(
    () => FantasyService.getAverageScore(tour, squads),
    [tour?.status, squads?.[0]?.scoreInfo.averageScore] // Убрали tour?.id
  );

  if (leagueLoading) {
    return <LoadingPage />;
  }
  if (leagueError) {
    return <ErrorPage error={leagueError} />;
  }
  if (!league) {
    return <ErrorPage error={new Error('League not found')} />;
  }

  if (tourError) {
    return <ErrorPage error={tourError} />;
  }
  if (!tourLoading && !tour) {
    return <ErrorPage error={new Error('Tour not found')} />;
  }

  if (!squadsLoading && !squads) {
    return <ErrorPage error={new Error('Squads not found')} />;
  }

  const tourSkeletonVisible = tourLoading || (squadsLoading && !isTourOpened);
  const squadsSkeletonVisible = tourLoading || squadsLoading || playersLoading;
  const matchesSkeletonVisible = matchesLoading;

  return (
    <Page back={false}>
      <List>
        <Section>
          <Select header="Лига" disabled>
            <option>{league.name}</option>
          </Select>
        </Section>
        <Section header={toursHeader}>
          <Pagination
            hideNextButton
            hidePrevButton
            boundaryCount={1}
            count={availableToursCount}
            siblingCount={1}
            page={currentTourNumber}
            onChange={handleTourChange}
          />
          <Skeleton visible={tourSkeletonVisible}>
            <Accordion expanded={isTourExpanded} onChange={handleTourExpand}>
              <Accordion.Summary
                hint={tourStatusHint}
                titleBadge={
                  shouldShowTourBadge ? <Badge type="dot" /> : undefined
                }
                subtitle={tourSubtitle}
                after={
                  <Info type="text" subtitle={averageSubtitle}>
                    {averageScore}
                  </Info>
                }
              >
                {tour?.name}
              </Accordion.Summary>
              <AccordionContent>
                <Skeleton visible={matchesSkeletonVisible}>
                  <Section>
                    <Cell
                      className="double-cell"
                      before={
                        <div>
                          <Cell
                            readOnly
                            subtitle={'Краснодар'}
                            className="sub-cell"
                            hovered={false}
                            before={
                              <Avatar
                                size={24}
                                src="https://pictures.cdn.sports.ru/f_Dc699MLn_9HLAgalsId2XWKqlvx550N7GRv4prPMA/fill/600/600/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL1RFQU0vbWFpbi9mY19rcmFzbm9kYXJfMTc1MzAxNzA2Mi5wbmc.png"
                              />
                            }
                            after={
                              <Badge type="number" mode="gray">
                                9.234
                              </Badge>
                            }
                          />
                          <Cell
                            readOnly
                            subtitle={'Крылья Советов'}
                            hovered={false}
                            className="sub-cell"
                            before={
                              <Avatar
                                size={24}
                                src="https://pictures.cdn.sports.ru/e1-JgbyFaaVrzkNT97jp40a6T-v_FGpMCG2sMr7KWqY/fill/120/120/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL1RFQU0vbWFpbi9mY19rcnlsaXlhX3NvdmV0b3Zfc2FtYXJhLnBuZw.png"
                              />
                            }
                            after={<Badge type="number">1</Badge>}
                          />
                        </div>
                      }
                      hint="идет"
                      titleBadge={<Badge type="number">90+5'</Badge>}
                      description={'dddd'}
                    />
                  </Section>
                </Skeleton>
              </AccordionContent>
            </Accordion>
          </Skeleton>
        </Section>
        <Skeleton visible={squadsSkeletonVisible}>
          <Section header={<Section.Header>{squadsHeader}</Section.Header>}>
            <Divider />
            {squads?.map(squad => {
              const players = squadsPlayers?.find(
                squadPlayers => squadPlayers.squad.id === squad.squad.id
              );

              const place = FantasyService.getSquadPlace(tour, squad);
              const tourScore = FantasyService.getTourScore(tour, squad);
              const seasonScore = FantasyService.getSeasonScore(tour, squad);
              const squadBadge = FantasyService.getSquadBadge(tour, squad);
              const squadBadgeMode = FantasyService.getSquadBadgeMode(
                tour,
                squad
              );
              const squadDescription =
                FantasyService.getSquadDescription(players);
              const squadSubtitle = FantasyService.getSquadSubtitle(players);

              return (
                <Accordion
                  key={squad.squad.id}
                  expanded={expandedSquads.has(squad.squad.id)}
                  onChange={(isExpanded: boolean) =>
                    handleSquadExpand(squad.squad.id, isExpanded)
                  }
                >
                  <Accordion.Summary
                    titleBadge={
                      squadBadge ? (
                        <Badge type="number" mode={squadBadgeMode}>
                          {squadBadge}
                        </Badge>
                      ) : undefined
                    }
                    subhead={squad.squad.user.nick}
                    subtitle={squadSubtitle}
                    description={squadDescription}
                    before={
                      <Info type="text">
                        <span dangerouslySetInnerHTML={{ __html: place }} />
                      </Info>
                    }
                    after={
                      <Info type="text" subtitle={tourScore}>
                        {seasonScore}
                      </Info>
                    }
                  >
                    {squad.squad.name}
                  </Accordion.Summary>
                </Accordion>
              );
            })}
          </Section>
        </Skeleton>
      </List>
    </Page>
  );
};
