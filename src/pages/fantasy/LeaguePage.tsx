import { useParams, useSearchParams } from 'react-router-dom';
import { List, Section } from '@telegram-apps/telegram-ui';
import { useEffect, useMemo, type FC } from 'react';

import { Page, LoadingPage, ErrorPage } from '@/components/Page';
import { LeagueSelector } from '@/components/League';
import { TourSelector } from '@/components/Tour';
import { SquadRating } from '@/components/Squad';
import {
  useLeagueById,
  useLeagueSquadsWithTourRating,
  useLeagueSquadsWithSeasonRating,
  useLeagueSquadsCurrentTourInfo,
} from '@/hooks/useLeague';
import { useTourById, useTourMatches } from '@/hooks/useTour';
import { TourService, LeagueService } from '@/services';

export const LeaguePage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
  const isTourCurrent = useMemo(
    () => tour?.id === currentTourId,
    [tour?.id, currentTourId]
  );

  // Current Tour Matches
  const { data: currentMatches, loading: matchesLoading } = useTourMatches(
    tourId!,
    {
      skip: !tourId || !isTourCurrent,
    }
  );

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

  //Switch Tour
  const handleTourChange = (tourId: string): void => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tourId', tourId);
    setSearchParams(newSearchParams);
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

  const availableTours = TourService.filterAvailableTours(
    league?.season?.tours
  );

  return (
    <Page back={false}>
      <List>
        <Section>
          <LeagueSelector league={league} />
        </Section>
        <Section>
          <TourSelector
            tour={tour}
            tours={availableTours}
            currentMatches={currentMatches}
            isTourCurrent={isTourCurrent}
            tourLoading={tourLoading || matchesLoading}
            onTourChange={handleTourChange}
          />
        </Section>
        <Section>
          <SquadRating
            squads={squads}
            squadsCurrentTourInfo={squadsCurrentTourInfo}
            tour={tour}
            currentMatches={currentMatches}
            isTourCurrent={isTourCurrent}
            squadsLoading={
              tourLoading || squadsLoading || currentTourInfoLoading
            }
          />
        </Section>
      </List>
    </Page>
  );
};
