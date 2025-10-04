import { graphql } from '@/gql/generated';

/**
 * GraphQL query to fetch tournament data including current season and tours information.
 * Used for getting tournament structure, current tour, and available tours list.
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
