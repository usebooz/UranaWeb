import { graphql } from '@/gql/generated';

/**
 * Query to get league squads with rating
 */
graphql(`
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
              placeAfterTour
              pointsAfterTour
              placeAfterTourDiff
            }
            squad {
              id
              name
              user {
                id
                nick
              }
              benefit {
                benefitType
                isApply
                isActive
              }
              seasonScoreInfo {
                score
                place
                totalPlaces
              }
            }
          }
        }
      }
    }
  }
`);

/**
 *
 */
graphql(`
  query GetLeagueSquadsWithCurrentTourInfo(
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
              placeAfterTour
              pointsAfterTour
              placeAfterTourDiff
            }
            squad {
              id
              name
              user {
                id
                nick
              }
              benefit {
                benefitType
                isApply
                isActive
              }
              seasonScoreInfo {
                score
                place
                totalPlaces
              }
              currentTourInfo {
                tour {
                  id
                }
                isNotLimit
                transfersDone
                transfersLeft
                currentBalance
                totalPrice
                players {
                  isCaptain
                  isViceCaptain
                  isStarting
                  substitutePriority
                  points
                  score
                  isPointsCount
                  playedMatchesTour
                  seasonPlayer {
                    id
                    name
                    role
                    status {
                      status
                    }
                    statObject {
                      id
                      firstName
                      lastName
                    }
                    team {
                      id
                      name
                      statObject {
                        id
                      }
                      svgKit {
                        url
                      }
                    }
                  }
                  statPlayer {
                    points
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

/**
 *
 */
graphql(`
  query GetSquadTourInfo($tourId: ID!, $squadId: ID!) {
    fantasyQueries {
      squadTourInfo(input: { tourID: $tourId, squadID: $squadId }) {
        tour {
          id
        }
        isNotLimit
        transfersDone
        transfersLeft
        currentBalance
        totalPrice
        players {
          isCaptain
          isViceCaptain
          isStarting
          substitutePriority
          points
          score
          isPointsCount
          playedMatchesTour
          seasonPlayer {
            id
            name
            role
            status {
              status
            }
            statObject {
              id
              firstName
              lastName
            }
            team {
              id
              name
              statObject {
                id
              }
              svgKit {
                url
              }
            }
          }
          statPlayer {
            points
          }
        }
      }
    }
  }
`);
