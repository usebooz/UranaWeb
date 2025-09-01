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
import { Player } from '@/components/Player/Player';
import { Match } from '@/components/Match/Match';
import {
  useLeagueById,
  useTourById,
  useLeagueSquadsWithTourRating,
  useLeagueSquadsWithSeasonRating,
  useLeagueSquadsCurrentTourInfo,
  useTourMatches,
} from '@/hooks/useFantasy';
import {
  MatchService,
  TourService,
  LeagueService,
  PlayerService,
  SquadService,
} from '@/services';
import { FantasyPlayerRole } from '@/gql/generated/graphql';
import { SquadTourInfo, SquadTourPlayer } from '@/gql';

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

  // Squads
  const seasonId = useMemo(() => league?.season?.id, [league?.season?.id]);
  const isTourScoreAvailable = useMemo(
    () => TourService.isScoreAvailable(tour),
    [tour?.status]
  );
  const seasonRatingSkip = !seasonId || !leagueId || isTourScoreAvailable;
  const tourRatingSkip = !leagueId || !tourId || !isTourScoreAvailable;
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
    setExpandedSquads(new Set());
    setIsTourExpanded(false);
    setShouldLoadMatches(false);
  }, [tourId]);

  //Start Load Matches
  useEffect(() => {
    if (isTourCurrent) {
      setShouldLoadMatches(true);
    }
  }, [isTourCurrent]);

  // //Logging (DO NOT DELETE)
  // useEffect(() => {
  //   console.log('leagueId:', leagueId);
  //   console.log('seasonId:', seasonId);
  //   console.log('isTourScoreAvailable:', isTourScoreAvailable);
  //   console.log('seasonRatingSkip:', seasonRatingSkip);
  //   console.log('tourRatingSkip', tourRatingSkip);
  //   console.log('squadsLoading:', squadsLoading);
  //   console.log('squads', squads);
  // }, [
  //   seasonRatingSkip,
  //   tourRatingSkip,
  //   leagueId,
  //   seasonId,
  //   isTourScoreAvailable,
  //   squadsLoading,
  //   squads,
  // ]);

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
                <Section>{renderMatches()}</Section>
              </Accordion.Content>
            )}
          </Accordion>
        </Skeleton>
      </Section>
    );
  };

  //Matches Content
  const renderMatches = () => {
    if (!matches || matches.length === 0) {
      return <Placeholder header="Матчи не найдены" />;
    }

    return matches.map(match => <Match key={match.id} match={match} />);
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
        {renderSquads()}
      </Section>
    );
  };

  //Squads content
  const renderSquads = () => {
    if (!squads || squads.length === 0) {
      return <Placeholder header="Команды не найдены" />;
    }

    if (TourService.isInProgress(tour)) {
      // SquadService.recalculateSquadsLiveScore could be implemented here
    }

    return squads?.map(squad => {
      let seasonPlace,
        tourScore,
        seasonScore,
        seasonPlaceDiff,
        seasonPlaceDiffClass;
      if (isTourScoreAvailable) {
        seasonPlace = squad.scoreInfo.placeAfterTour.toString();
        tourScore = squad.scoreInfo.score.toString();
        seasonScore = squad.scoreInfo.pointsAfterTour.toString();
        seasonPlaceDiff = SquadService.formatPlaceDiff(squad);
        seasonPlaceDiffClass = SquadService.isPlaceDiffNegative(squad)
          ? 'info-subtitle-destructive-text-color'
          : 'info-subtitle-accent-text-color';
      } else {
        seasonPlace = squad.scoreInfo.place.toString();
        tourScore = SquadService.formatAverageScore(squad);
        seasonScore = squad.scoreInfo.score.toString();
      }
      const columnPlaceWidth = squad.scoreInfo.totalPlaces.toString().length;

      let squadTourInfo, playersPointsCount, squadTransfers;
      if (isTourCurrent) {
        squadTourInfo = squadsCurrentTourInfo?.find(
          s => s.id === squad.squad.id
        );

        playersPointsCount =
          TourService.isInProgress(tour) &&
          PlayerService.filterPlayersWithPointsCount(
            squadTourInfo?.tourInfo?.players || []
          )?.length.toString();

        const squadTransfersDone =
          squadTourInfo?.tourInfo?.transfersDone.toString();
        const squadTransfersTotal =
          SquadService.formatSquadTransfersTotal(squadTourInfo);
        squadTransfers =
          squadTransfersDone &&
          squadTransfersTotal &&
          `🔄 ${squadTransfersDone}/${squadTransfersTotal}`;
      }

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
              playersPointsCount ? (
                <Badge type="number">{playersPointsCount}</Badge>
              ) : undefined
            }
            subhead={squad.squad.user.nick}
            subtitle={squadTransfers}
            before={
              <Info
                type="text"
                className={`table-column-before ${seasonPlaceDiffClass}`}
                style={{
                  '--table-column-before--number': columnPlaceWidth,
                }}
                subtitle={seasonPlaceDiff}
              >
                {seasonPlace}
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
          <Accordion.Content className="secondary-bg-color">
            {renderSquadInfo(squadTourInfo)}
          </Accordion.Content>
        </Accordion>
      );
    });
  };

  const renderSquadInfo = (squadTourInfo?: SquadTourInfo) => {
    const players = squadTourInfo?.tourInfo?.players;
    if (!players || players.length === 0) {
      return <Placeholder header="Игроки не найдены" />;
    }
    const matchesFinished = TourService.isFinished(tour);
    const withoutBadge = !matchesFinished && !isTourCurrent;
    const subEmoji = '🪑';

    const playersStarted = [
      FantasyPlayerRole.Goalkeeper,
      FantasyPlayerRole.Defender,
      FantasyPlayerRole.Midfielder,
      FantasyPlayerRole.Forward,
    ].map((role, i) => {
      const roleKey = squadTourInfo.id + i;
      const rolePlayers = PlayerService.filterStartPlayersByRole(players, role);
      const fakePlayer = { seasonPlayer: { role: role } } as SquadTourPlayer;

      return (
        <Cell
          key={roleKey}
          className="cell-display-block cell-align-items-center cell-overflow-visible"
          readOnly
          before={
            <Info
              type="text"
              subtitle={PlayerService.getRoleEmoji(fakePlayer)}
            />
          }
        >
          {rolePlayers.map((player, j) => (
            <Player
              key={roleKey + j}
              player={player}
              matches={matches}
              matchesFinished={matchesFinished}
              withoutBadge={withoutBadge}
            />
          ))}
        </Cell>
      );
    });

    const subKey = squadTourInfo.id + 5;
    const subPlayers = PlayerService.filterPlayersOnBench(players);
    const substitutes = (
      <Cell
        key={subKey}
        className="cell-display-block cell-overflow-visible"
        readOnly
        before={<Info type="text" subtitle={subEmoji} />}
        hovered
      >
        {subPlayers.map((player, j) => (
          <Player
            key={subKey + j}
            player={player}
            matches={matches}
            matchesFinished={matchesFinished}
            withoutBadge={withoutBadge}
          />
        ))}
      </Cell>
    );

    return [...playersStarted, substitutes];
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
