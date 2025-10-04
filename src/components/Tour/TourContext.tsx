import { createContext } from 'react';

/**
 * React context for providing tour ID throughout the component tree.
 * Used to share the current tour identifier across components without prop drilling.
 */
export const TourContext = createContext<string | undefined>(undefined);
