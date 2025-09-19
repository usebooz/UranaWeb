import { graphql } from '@/gql/generated';

/**
 * Query to get tournament
 */
graphql(`
  query GetTournament($id: ID!) {
    fantasyQueries {
      tournament(source: HRU, id: $id) {
        id
        currentSeason {
          id
          isActive
          tours {
            name
            id
            status
          }
          currentTour {
            id
            name
            status
          }
        }
      }
    }
  }
`);
