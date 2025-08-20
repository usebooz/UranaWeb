import { graphql } from '@/gql/generated';

/**
 * Query to get league
 */
export const LEAGUE_QUERY = graphql(`
  query GetLeague($id: ID!) {
    fantasyQueries {
      league(source: ID, id: $id) {
        id
        name
        type
        season {
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

/**
 * Query to get league squads with rating
 */
export const LEAGUE_SQUADS_QUERY = graphql(`
  query GetLeagueSquads(
    $leagueId: ID!
    $entityType: FantasyRatingEntityType!
    $entityId: ID!
  ) {
    fantasyQueries {
      rating {
        squads(
          input: {
            leagueID: $leagueId
            entityType: $entityType
            entityID: $entityId
            sortOrder: ASC
            pageSize: 90
            pageNum: 1
          }
        ) {
          list {
            scoreInfo {
              place
              score
              totalPlaces
              averageScore
              placeDiff
              scoreForLastTour
              topPercent
              topColor
              placeAfterTour
              pointsAfterTour
              placeAfterTourDiff
            }
            squad {
              name
              id
              user {
                id
                nick
              }
            }
          }
        }
      }
    }
  }
`);
