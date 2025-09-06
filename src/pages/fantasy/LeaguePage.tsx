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
  Spinner,
  Placeholder,
} from '@telegram-apps/telegram-ui';
import { useEffect, useState, useMemo, type FC } from 'react';

import { Page } from '@/components/Page/Page';
import { LoadingPage } from '@/components/Page/LoadingPage';
import { ErrorPage } from '@/components/Page/ErrorPage';
import { MatchList } from '@/components/Match/MatchList';
import { SquadList } from '@/components/Squad/SquadList';
import {
  useLeagueById,
  useLeagueSquadsWithTourRating,
  useLeagueSquadsWithSeasonRating,
  useLeagueSquadsCurrentTourInfo,
} from '@/hooks/useLeague';
import { useTourById, useTourMatches } from '@/hooks/useTour';
import {
  MatchService,
  TourService,
  LeagueService,
  SquadService,
} from '@/services';

export const LeaguePage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    () => LeagueService.getCurrentTourId(league),
    [league?.season.currentTour?.id]
  );
  const isLeagueFromActiveRplSeason = useMemo(
    () => LeagueService.isFromActiveRplSeason(league),
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
    () => TourService.isFromLeague(tour, league?.season.tours),
    [league?.season.tours.length, tour?.id]
  );
  const isTourAvailable = useMemo(
    () => TourService.isAvailable(tour),
    [tour?.status]
  );

  // Matches
  const matchesSkip = !tourId || !shouldLoadMatches;
  const { data: matches, loading: matchesLoading } = useTourMatches(tourId!, {
    skip: matchesSkip,
  });

  // Squads Rating
  const seasonId = useMemo(() => league?.season?.id, [league?.season?.id]);
  const isTourScoreAvailable = useMemo(
    () => TourService.isScoreAvailable(tour),
    [tour?.status]
  );
  // Season Rating
  const seasonRatingSkip = !seasonId || !leagueId || isTourScoreAvailable;
  const seasonRatingResult = useLeagueSquadsWithSeasonRating(
    leagueId!,
    seasonId!,
    {
      skip: seasonRatingSkip,
    }
  );
  // Tour Rating
  const tourRatingSkip = !leagueId || !tourId || !isTourScoreAvailable;
  const tourRatingResult = useLeagueSquadsWithTourRating(leagueId!, tourId!, {
    skip: tourRatingSkip,
  });
  // Choose Squads source by available rating
  const { data: squads, loading: squadsLoading } = isTourScoreAvailable
    ? tourRatingResult
    : seasonRatingResult;

  // Squads with Players for Current Tour
  const isTourCurrent = useMemo(
    () => tour?.id === currentTourId,
    [tour?.id, currentTourId]
  );
  const { data: squadsCurrentTourInfo, loading: currentTourInfoLoading } =
    useLeagueSquadsCurrentTourInfo(leagueId!, seasonId!, {
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
    setIsTourExpanded(false);
    setShouldLoadMatches(false);
  }, [tourId]);

  //Start Load Matches
  useEffect(() => {
    // Not only for in-progress
    // For Opened tour before 1 hour we need lineups
    if (isTourCurrent) {
      setShouldLoadMatches(true);
    }
  }, [isTourCurrent]);

  //Switch Tour
  const handleTourChange = (_event: unknown, page: number): void => {
    const selectedTour = TourService.findTourByPage(page, league?.season.tours);

    if (selectedTour) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tourId', selectedTour.id);
      setSearchParams(newSearchParams);
    }
  };

  //Expand Tour
  const handleTourExpand = (isExpanded: boolean) => {
    setIsTourExpanded(isExpanded);
    // Load matches on first accordion expand (if not IN_PROGRESS)
    if (isExpanded && !shouldLoadMatches) {
      setShouldLoadMatches(true);
    }
  };

  //League Section
  if (leagueError) {
    return <ErrorPage error={leagueError} />;
  }
  if (leagueLoading) {
    return <LoadingPage />;
  }
  if (!league || !isLeagueFromActiveRplSeason) {
    return <ErrorPage error={new Error('Лига не найдена')} />;
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
  //Tour is being set in parameters
  if (!tourLoading && !tour && !tourId && currentTourId) {
    return <LoadingPage />;
  }
  if (
    (!tour && !tourLoading) ||
    (tour && (!isTourFromLeague || !isTourAvailable))
  ) {
    return <ErrorPage error={new Error('Тур не найден')} />;
  }
  const renderTourSection = () => {
    const tourSkeletonVisible =
      tourLoading || (isTourCurrent && matchesLoading);
    const availableToursCount =
      TourService.filterAvailableTours(league.season?.tours).length || 0;
    const currentTourNumber = TourService.extractNumber(tour);
    const tourHint = TourService.formatStatus(tour) || '░░░░░░░░░░';
    let matchesStartedCount;
    if (TourService.isInProgress(tour)) {
      matchesStartedCount =
        MatchService.filterMatchesStarted(matches)?.length.toString();
    }

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
        <Skeleton visible={tourSkeletonVisible}>
          <Accordion expanded={isTourExpanded} onChange={handleTourExpand}>
            <Accordion.Summary
              hint={tourHint}
              titleBadge={
                matchesStartedCount ? (
                  <Badge type="number">{matchesStartedCount}</Badge>
                ) : undefined
              }
            >
              {tour?.name}
            </Accordion.Summary>
            {isTourExpanded && matchesLoading && (
              <Accordion.Content>
                <Placeholder>
                  <Spinner size="m" />
                </Placeholder>
              </Accordion.Content>
            )}
            {isTourExpanded && !matchesLoading && (
              <Accordion.Content>
                <Section>
                  <MatchList matches={matches} />
                </Section>
              </Accordion.Content>
            )}
          </Accordion>
        </Skeleton>
      </Section>
    );
  };

  //Squads Section
  const renderSquadsSection = () => {
    if (tourLoading || squadsLoading || currentTourInfoLoading) {
      return (
        <Section>
          <Placeholder>
            <Spinner size="m" />
          </Placeholder>
        </Section>
      );
    }

    const squadsCount = SquadService.getSquadsCount(squads);
    const columnPlaceWidth = squadsCount?.length;
    const columnPlace = '🔝';
    const columnSquad = `Команда (${squadsCount})`;

    let columnScore, squadsHeader;
    if (isTourScoreAvailable) {
      const winnerSquad = SquadService.findTourWinner(squads);
      const winnerName =
        winnerSquad &&
        `${winnerSquad.squad.name} (${winnerSquad.scoreInfo.score})`;
      squadsHeader =
        !!winnerName && TourService.isFinished(tour)
          ? `👑 ${winnerName}`
          : `1️⃣ ${winnerName}`;
      columnScore = `Всего/Тур (${SquadService.formatSquadsTourAverageScore(squads)})`;
    } else {
      columnScore = 'Всего/В среднем';
    }

    return (
      <Section header={squadsHeader} className="table-title">
        <Cell
          readOnly
          className="table-headers"
          before={
            <Info
              type="text"
              className="table-column-before"
              style={{
                '--table-column-before--number': columnPlaceWidth,
              }}
              subtitle={columnPlace}
            />
          }
          subtitle={columnSquad}
          after={<Info type="text" subtitle={columnScore} />}
        />
        <SquadList
          squads={squads}
          squadsCurrentTourInfo={squadsCurrentTourInfo}
          tour={tour}
          matches={matches}
          isTourCurrent={isTourCurrent}
        />
      </Section>
    );
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
