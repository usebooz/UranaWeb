import { type FC } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { SquadItem } from './SquadItem';
import { useContextSquads } from '@/hooks';

/**
 *
 *
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
