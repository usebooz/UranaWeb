import { type FC } from 'react';
import { Select } from '@telegram-apps/telegram-ui';
import { useContextLeague } from '@/hooks';

/**
 * Component for displaying the current league in a disabled select.
 * Shows the league name from context and prevents user interaction.
 * Used for informational display of the current league.
 *
 * @returns Disabled select component showing current league name
 */
export const LeagueSelector: FC = () => {
  const league = useContextLeague();

  return (
    <Select header="Лига" disabled>
      <option>{league?.name}</option>
    </Select>
  );
};
