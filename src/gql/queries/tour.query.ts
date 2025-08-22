import { graphql } from '@/gql/generated';

/**
 * Query to get tour
 */
graphql(`
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
      }
    }
  }
`);

/**
 * Query to get tour matches
 */
graphql(`
  query GetTourMatches($id: ID!) {
    fantasyQueries {
      tour(id: $id) {
        id
        matches {
          id
          matchStatus
          scheduledAt
          currentTime
          home {
            score
            team {
              name
              logo {
                main
              }
            }
          }
          away {
            score
            team {
              name
              logo {
                main
              }
            }
          }
          prediction {
            yellowCards
            goals
          }
          bettingOdds(iso2Country: "", placementType: FANTASY_MATCH) {
            line1x2 {
              h
              a
            }
          }
        }
      }
    }
  }
`);
