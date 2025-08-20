import { graphql } from '@/gql/generated';

/**
 * Query to get tour
 */
export const TOUR_QUERY = graphql(`
  query GetTour($id: ID!) {
    fantasyQueries {
      tour(id: $id) {
        id
        name
        status
        startedAt
        finishedAt
        transfersStartedAt
        transfersFinishedAt
        matches {
          id
          status
          matchStatus
          scheduledAt
        }
      }
    }
  }
`);
