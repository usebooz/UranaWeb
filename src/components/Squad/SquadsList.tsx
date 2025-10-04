import { type FC } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { SquadItem } from './SquadItem';
import { useContextSquads } from '@/hooks';

/**
 * Component that displays a list of squads from the current context.
 * Shows each squad as an expandable SquadItem or a placeholder if no squads are found.
 * Used to render the main squads listing in league views.
 *
 * @returns List of squad items or placeholder for empty state
 */
export const SquadsList: FC = () => {
  const squads = useContextSquads();
  if (!squads || squads.length === 0) {
    return <Placeholder header="Команды не найдены" />;
  }

  return (
    <>
      {squads.map(squad => {
        return <SquadItem key={squad.squad.id} squad={squad} />;
      })}
    </>
  );
};
