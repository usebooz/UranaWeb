import { type FC } from 'react';
import { Badge } from '@telegram-apps/telegram-ui';

import { SquadService } from '@/services';
import { LeagueSquad } from '@/gql';

interface SquadTopProps {
  /**
   *
   */
  squad: LeagueSquad;
}

/**
 *
 *
 */
export const SquadTop: FC<SquadTopProps> = ({ squad }) => {
  const squadTop = SquadService.formatSquadTop(squad);

  return (
    squadTop && (
      <Badge type="number" className="squad-top" mode="secondary">
        {squadTop}
      </Badge>
    )
  );
};
