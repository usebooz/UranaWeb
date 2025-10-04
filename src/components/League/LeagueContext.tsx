import { createContext } from 'react';

/**
 * React context for providing league ID throughout the component tree.
 * Used to share the current league identifier across components without prop drilling.
 */
export const LeagueContext = createContext<string | undefined>(undefined);
