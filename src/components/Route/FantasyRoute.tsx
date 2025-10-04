import { Route, Routes } from 'react-router-dom';
import { LeaguePage } from '@/pages/fantasy';
import { ApolloProvider } from '@apollo/client/react';
import { Suspense } from 'react';
import { PlaceSpinner } from '../Loading';
import { TournamentContext } from '../Tournament';
import { sportsClient } from '@/gql/client';
import { TournamentService } from '@/services';

/**
 * Fantasy route component that provides routing for fantasy football features.
 * Sets up Apollo Client provider for Sports.ru API integration and tournament context.
 * Includes suspense boundary for loading states and provides RPL tournament context.
 *
 * @returns Fantasy routes with Apollo provider and tournament context
 */
export function FantasyRoute() {
  return (
    <ApolloProvider client={sportsClient}>
      <Suspense fallback={<PlaceSpinner />}>
        <TournamentContext value={TournamentService.rplWebname}>
          <Routes>
            <Route path="/league/:leagueId" Component={LeaguePage} />
          </Routes>
        </TournamentContext>
      </Suspense>
    </ApolloProvider>
  );
}
