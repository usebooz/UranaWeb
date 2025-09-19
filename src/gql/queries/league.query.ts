import { graphql } from '@/gql/generated';

/**
 * Query to get league
 */
graphql(`
  query GetLeague($id: ID!) {
    fantasyQueries {
      league(source: ID, id: $id) {
        id
        name
        type
        season {
          id
        }
      }
    }
  }
`);
