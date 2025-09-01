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
          winner
          periodId
          hasLineups
          home {
            score
            team {
              id
              name
              logo {
                main
              }
            }
            lineup(skipPreview: true) {
              player {
                id
              }
              lineupStarting
            }
          }
          away {
            score
            team {
              id
              name
              logo {
                main
              }
            }
            lineup(skipPreview: true) {
              player {
                id
              }
              lineupStarting
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
