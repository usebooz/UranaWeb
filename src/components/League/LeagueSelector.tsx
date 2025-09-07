import { type FC } from 'react';
import { Select } from '@telegram-apps/telegram-ui';
import type { League } from '@/gql';

/**
 * Props for the LeagueSelector component
 */
interface LeagueSelectorProps {
  /** League data */
  league: League;
}

/**
 * LeagueSelector component for displaying selected league
 * Simple read-only selector showing current league name
 */
export const LeagueSelector: FC<LeagueSelectorProps> = ({ league }) => (
  <Select header="Лига" disabled>
    <option>{league?.name}</option>
  </Select>
);
