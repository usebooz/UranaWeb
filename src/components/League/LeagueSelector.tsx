import { type FC } from 'react';
import { Select } from '@telegram-apps/telegram-ui';
import { useContextLeague } from '@/hooks';

/**
 *
 */
export const LeagueSelector: FC = () => {
  const league = useContextLeague();

  return (
    <Select header="Лига" disabled>
      <option>{league?.name}</option>
    </Select>
  );
};
