import { createContext } from 'react';

/**
 * React context for providing tournament webname throughout the component tree.
 * Used to share the current tournament identifier across components without prop drilling.
 */
export const TournamentContext = createContext<string | undefined>(undefined);
