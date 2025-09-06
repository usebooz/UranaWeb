import { type FC } from 'react';
import { Cell, Info, Badge, Avatar } from '@telegram-apps/telegram-ui';
import { MatchService } from '@/services';
import type { TourMatch } from '@/gql';

import './Match.css';

interface MatchItemProps {
  /**
   * Match data containing teams, scores, betting odds, and status information
   */
  match: TourMatch;
}

/**
 * Match component displays a single match with team logos, scores, betting odds, and match status
 * @param props - Component props containing match data
 * @returns JSX element representing a match cell
 */
export const MatchItem: FC<MatchItemProps> = ({ match }) => {
  let teamWinner, teamBefore, teamAfter;
  if (MatchService.isHomeWinner(match)) {
    teamWinner = match.home?.team?.name;
    teamAfter = match.away?.team?.name;
  } else if (MatchService.isAwayWinner(match)) {
    teamBefore = match.home?.team?.name;
    teamWinner = match.away?.team?.name;
  } else {
    teamBefore = match.home?.team?.name;
    teamAfter = match.away?.team?.name;
  }

  let homeBet, awayBet, homeScore, awayScore;
  if (MatchService.isNotStarted(match)) {
    homeBet = match.bettingOdds[0]?.line1x2?.h?.toString();
    awayBet = match.bettingOdds[0]?.line1x2?.a?.toString();
  } else {
    homeScore = match.home?.score.toString();
    awayScore = match.away?.score.toString();
  }

  let scoreClass;
  if (MatchService.isInProgress(match)) {
    scoreClass = 'info-accent-text-color';
  } else {
    scoreClass = 'info-text-color';
  }

  const matchCurrentTime = MatchService.formatCurrentTime(match);
  const matchScheduledAt = MatchService.formatMatchScheduledAt(match);
  let matchInfo;
  if (MatchService.isInProgress(match)) {
    matchInfo = <Badge type="number">{matchCurrentTime}</Badge>;
  }
  if (MatchService.isNotStarted(match))
    matchInfo = <Info type="text" subtitle={matchScheduledAt}></Info>;

  return (
    <Cell
      className="match-cell"
      before={
        <div className="match-logos">
          <Avatar
            size={24}
            src={match.home?.team?.logo.main}
            fallbackIcon={<span>👥</span>}
            className="white-bg-color"
          />
          <Avatar
            size={24}
            src={match.away?.team?.logo.main}
            fallbackIcon={<span>👥</span>}
            className="white-bg-color"
          />
        </div>
      }
      subhead={teamBefore}
      subtitle={teamAfter}
      after={
        <Info type="avatarStack" avatarStack={matchInfo}>
          <div className="match-scores">
            <Info type="text" subtitle={homeBet} className={scoreClass}>
              {homeScore}
            </Info>
            <Info type="text" subtitle={awayBet} className={scoreClass}>
              {awayScore}
            </Info>
          </div>
        </Info>
      }
    >
      {teamWinner}
    </Cell>
  );
};
