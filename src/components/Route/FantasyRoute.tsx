import { Route, Routes } from 'react-router-dom';
import { LeaguePage } from '@/pages/fantasy';
import { ApolloProvider } from '@apollo/client';
import { Suspense } from 'react';
import { PlaceSpinner } from '../Loading';
import { TournamentContext } from '../Tournament';
import { sportsClient } from '@/gql/client';
import { TournamentService } from '@/services';

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
