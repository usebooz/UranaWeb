import { type FC } from 'react';
import { Badge } from '@telegram-apps/telegram-ui';

import { SquadService } from '@/services';
import { LeagueSquad } from '@/gql';

/**
 * Props for SquadTop component.
 */
interface SquadTopProps {
  /** The league squad data */
  squad: LeagueSquad;
}

/**
 * Component that displays a squad's top ranking badge.
 * Shows the squad's position in the overall tournament ranking if they are in top positions.
 * Only renders if the squad has a notable ranking position.
 *
 * @param props - The component props
 * @returns Badge with squad's top ranking or null if not in top positions
 */
export const SquadTop: FC<SquadTopProps> = ({ squad }) => {
  const squadTop = SquadService.formatSquadTop(squad);

  return (
    squadTop && (
      <Badge type="number" className="cell-badge-flex-0" mode="secondary">
        {squadTop}
      </Badge>
    )
  );
};
