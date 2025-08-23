import { useParams, useSearchParams } from 'react-router-dom';
import {
  Accordion,
  Badge,
  Cell,
  Info,
  List,
  Pagination,
  Section,
  Select,
  Skeleton,
  Avatar,
  Spinner,
  Placeholder,
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
  const currentTourId = useMemo(
    () => FantasyService.getCurrentTourId(league),
    [league?.season.currentTour?.id]
  );
  const isLeagueFromActiveRplSeason = useMemo(
    () => FantasyService.isLeagueFromActiveRplSeason(league),
    [league?.season]
  );

  // Tour
  const tourId = searchParams.get('tourId');
  const {
    data: tour,
    loading: tourLoading,
    error: tourError,
  } = useTourById(tourId!, {
    skip: !tourId,
  });
  const isTourFromLeague = useMemo(
    () => FantasyService.isTourFromLeague(league, tour),
    [league?.season.tours.length, tour?.id]
  );
  const isTourAvailable = useMemo(
    () => FantasyService.isTourAvailable(tour),
    [tour?.status]
  );

  // Matches
  const isTourInProgress = useMemo(
    () => FantasyService.isTourInProgress(tour),
    [tour?.status]
  );
  const matchesSkip = !tourId || !shouldLoadMatches;
  const { data: matches, loading: matchesLoading } = useTourMatches(tourId!, {
    skip: matchesSkip,
  });

  // Squads
  const seasonId = useMemo(
    () => FantasyService.getSeasonId(league),
    [league?.season?.id]
  );
  const isTourOpened = useMemo(
    () => FantasyService.isTourOpened(tour),
    [tour?.status]
  );
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

  //Set Current Tour
  useEffect(() => {
    if (tourId || !currentTourId) {
      return;
    }
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tourId', currentTourId);
    setSearchParams(newSearchParams);
  }, [tourId, currentTourId, setSearchParams]);

  //Change Tour
  useEffect(() => {
    setExpandedSquads(new Set());
    setIsTourExpanded(false);
    setShouldLoadMatches(false);
  }, [tourId]);

  //Start Load Matches
  useEffect(() => {
    if (isTourInProgress) {
      setShouldLoadMatches(true);
    }
  }, [isTourInProgress]);

  //Switch Tour
  const handleTourChange = (_event: unknown, page: number): void => {
    const selectedTour = FantasyService.getTourByPage(league, page);

    if (selectedTour) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tourId', selectedTour.id);
      setSearchParams(newSearchParams);
    }
  };

  //Expand Tour
  const handleTourExpand = (isExpanded: boolean) => {
    setIsTourExpanded(isExpanded);
    // При первом разворачивании аккордеона загружаем матчи (если не IN_PROGRESS)
    if (isExpanded && !shouldLoadMatches) {
      setShouldLoadMatches(true);
    }
  };

  //Expand Squad
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

  //League Section
  if (leagueError) {
    return <ErrorPage error={leagueError} />;
  }
  if (leagueLoading) {
    return <LoadingPage />;
  }
  if (!league || !isLeagueFromActiveRplSeason) {
    return <ErrorPage error={new Error('League not found')} />;
  }
  const renderLeagueSection = () => (
    <Section>
      <Select header="Лига" disabled>
        <option>{league.name}</option>
      </Select>
    </Section>
  );

  //Tour Section
  if (tourError) {
    return <ErrorPage error={tourError} />;
  }
  //Устанавливается тур в параметры
  if (!tourLoading && !tour && !tourId && currentTourId) {
    return <LoadingPage />;
  }
  if (
    (!tour && !tourLoading) ||
    (tour && (!isTourFromLeague || !isTourAvailable))
  ) {
    return <ErrorPage error={new Error('Tour not found')} />;
  }
  const renderTourSection = () => {
    const availableToursCount = FantasyService.getAvailableToursCount(league);
    const currentTourNumber = FantasyService.getTourNumber(tour);
    const tourHint = FantasyService.getTourStatusText(tour);
    const tourBadge = FantasyService.isTourInProgress(tour) ? (
      <Badge type="number">
        {FantasyService.getPlayedMatchesCount(matches)}
      </Badge>
    ) : undefined;

    return (
      <Section>
        <Pagination
          hideNextButton
          hidePrevButton
          boundaryCount={1}
          count={availableToursCount}
          siblingCount={1}
          page={currentTourNumber}
          onChange={handleTourChange}
        />
        <Skeleton visible={tourLoading}>
          <Accordion expanded={isTourExpanded} onChange={handleTourExpand}>
            <Accordion.Summary hint={tourHint} titleBadge={tourBadge}>
              {tour?.name}
            </Accordion.Summary>
            {isTourExpanded && matchesLoading && (
              <AccordionContent>
                <Placeholder>
                  <Spinner size="m" />
                </Placeholder>
              </AccordionContent>
            )}
            {isTourExpanded && !matchesLoading && (
              <AccordionContent>
                <Section>{renderMatches()}</Section>
              </AccordionContent>
            )}
          </Accordion>
        </Skeleton>
      </Section>
    );
  };

  //Matches Content
  const renderMatches = () => {
    if (!matches || matches.length === 0) {
      return <Placeholder header="Matches not found" />;
    }

    return matches.map(match => {
      let teamWinner, teamBefore, teamAfter;
      if (FantasyService.isMatctHomeWinner(match)) {
        teamWinner = match.home?.team?.name;
        teamAfter = match.away?.team?.name;
      } else if (FantasyService.isMatctAwayWinner(match)) {
        teamBefore = match.home?.team?.name;
        teamWinner = match.away?.team?.name;
      } else {
        teamBefore = match.home?.team?.name;
        teamAfter = match.away?.team?.name;
      }

      let homeBet, awayBet, homeScore, awayScore;
      if (FantasyService.isMatchNotStarted(match)) {
        homeBet = match.bettingOdds[0]?.line1x2?.h?.toString();
        awayBet = match.bettingOdds[0]?.line1x2?.a?.toString();
      } else {
        homeScore = match.home?.score.toString();
        awayScore = match.away?.score.toString();
      }
      let scoreColor;
      if (FantasyService.isMatchInProgress(match)) {
        scoreColor = 'var(--tg-theme-accent-text-color)';
      } else {
        scoreColor = 'var(--tg-theme-text-color)';
      }

      const matchCurrentTime = FantasyService.getMatchCurrentTime(match);
      const matchScheduledAt = FantasyService.formatMatchScheduledAt(match);
      let matchInfo;
      if (FantasyService.isMatchInProgress(match)) {
        matchInfo = <Badge type="number">{matchCurrentTime}</Badge>;
      }
      if (FantasyService.isMatchNotStarted(match))
        matchInfo = <Info type="text" subtitle={matchScheduledAt}></Info>;

      return (
        <Cell
          Component={'div'}
          className="match-cell"
          key={match.id}
          before={
            <div className="match-logos">
              <Avatar
                size={20}
                src={match.home?.team?.logo.main}
                style={{ backgroundColor: 'white' }}
              />
              <Avatar
                size={20}
                src={match.away?.team?.logo.main}
                style={{ backgroundColor: 'white' }}
              />
            </div>
          }
          subhead={teamBefore}
          subtitle={teamAfter}
          after={
            <Info type="avatarStack" avatarStack={matchInfo}>
              <div className="match-scores">
                <Info
                  type="text"
                  subtitle={homeBet}
                  style={{ color: scoreColor }}
                >
                  {homeScore}
                </Info>
                <Info
                  type="text"
                  subtitle={awayBet}
                  className={scoreColor}
                  style={{
                    color: scoreColor,
                    fontWeight: 'var(--tgui--font_weight--accent3)',
                  }}
                >
                  {awayScore}
                </Info>
              </div>
            </Info>
          }
        >
          {teamWinner}
        </Cell>
      );
    });
  };

  //Squads Section
  const renderSquadsSection = () => {
    if (tourLoading || squadsLoading || playersLoading) {
      return (
        <Section>
          <Placeholder>
            <Spinner size="m" />
          </Placeholder>
        </Section>
      );
    }

    const columnPlace = '🔝';
    const columnSquad = `Команда (${FantasyService.getSquadsCount(squads)})`;

    let columnScore, squadsHeader;
    if (FantasyService.isTourScoreAvailable(tour)) {
      squadsHeader = FantasyService.getTourWinner(tour, squads);
      columnScore = `Всего/Тур (${FantasyService.getTourAverageScore(squads)})`;
    } else {
      columnScore = 'Всего/В среднем';
    }

    return (
      <Section header={squadsHeader}>
        <Cell
          readOnly
          className="table-header"
          before={<Info type="text" subtitle={columnPlace} />}
          subtitle={columnSquad}
          after={<Info type="text" subtitle={columnScore} />}
        />
        {renderSquads()};
      </Section>
    );
  };

  //Squads content
  const renderSquads = () => {
    if (!squads || squads.length === 0) {
      return <Placeholder header="Squads not found" />;
    }

    return squads?.map(squad => {
      const players = squadsPlayers?.find(
        squadPlayers => squadPlayers.squad.id === squad.squad.id
      );

      const place = FantasyService.getSquadPlace(tour, squad);
      const tourScore = FantasyService.getTourScore(tour, squad);
      const seasonScore = FantasyService.getSeasonScore(tour, squad);
      const squadBadge = FantasyService.getSquadBadge(tour, squad);
      const squadBadgeMode = FantasyService.getSquadBadgeMode(tour, squad);
      const squadDescription = FantasyService.getSquadDescription(players);
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
    });
  };

  return (
    <Page back={false}>
      <List>
        {renderLeagueSection()}
        {renderTourSection()}
        {renderSquadsSection()}
      </List>
    </Page>
  );
};
