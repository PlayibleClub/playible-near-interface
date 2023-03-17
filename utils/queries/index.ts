import { gql } from '@apollo/client';

export const GET_ATHLETES_TOP = gql`
  query GetAthletes($args: GetAthletesArgs) {
    getAthletes(args: $args) {
      id
      apiId
      firstName
      lastName
      position
      jersey
      salary
      isActive
      isInjured
      nftImage
      nftAnimation
      stats {
        fantasyScore
        week
        type
        season
      }
    }
  }
`;

export const GET_ATHLETE_BY_ID = gql`
  query GetAthleteById($getAthleteById: Float!, $to: DateTime, $from: DateTime) {
    getAthleteById(id: $getAthleteById, to: $to, from: $from) {
      nftAnimation
      nftImage
      isInjured
      isActive
      stats {
        season
        fantasyScore
        week
        type
        opponent {
          name
          key
        }
        gameDate
        played
      }
    }
  }
`

export const GET_ATHLETEDATA_QB = gql`
  query GetAthleteData_QB($getAthleteById: Float!) {
    getAthleteById(id: $getAthleteById) {
      id
      firstName
      lastName
      position
      isInjured
      isActive
      nftImage
      stats {
        type
        completion
        passingYards
        passingTouchdowns
        interceptions
        rushingYards
        rushingTouchdowns
        carries
        played
        opponent{
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_ATHLETEDATA_RB = gql`
  query GetAthleteData_RB($getAthleteById: Float!) {
    getAthleteById(id: $getAthleteById) {
      id
      firstName
      lastName
      position
      isInjured
      isActive
      nftImage
      stats {
        type
        carries
        rushingYards
        rushingTouchdowns
        receivingYards
        receivingTouchdowns
        receptions
        played
        opponent{
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_ATHLETEDATA_WR = gql`
  query GetAthleteData_WR($getAthleteById: Float!) {
    getAthleteById(id: $getAthleteById) {
      id
      firstName
      lastName
      position
      isInjured
      isActive
      nftImage
      stats {
        type
        targets
        receptions
        receivingYards
        receivingTouchdowns
        played
        opponent{
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_ATHLETEDATA_TE = gql`
  query GetAthleteData_TE($getAthleteById: Float!) {
    getAthleteById(id: $getAthleteById) {
      id
      firstName
      lastName
      position
      isInjured
      isActive
      nftImage
      stats {
        type
        targets
        receptions
        receivingYards
        receivingTouchdowns
        played
        opponent{
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_ATHLETEDATA_NBA = gql`
  query GetAthleteData_NBA($getAthleteById: Float!) {
    getAthleteById(id: $getAthleteById) {
      id
      firstName
      lastName
      position
      isInjured
      isActive
      nftImage
      stats {
        type
        assists
        points
        rebounds
        blockedShots
        steals
        turnovers
        played
        opponent{
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_NBA_CURRENT_SEASON = gql`
  query GetNbaCurrentSeason {
    getNbaCurrentSeason {
      apiSeason
    }
}
`;

export const GET_NFL_SEASON = gql`
  query GetNflSeason($startDate: DateTime!) {
    getNflSeason(startDate: $startDate) {
      apiName
      apiSeason
      apiWeek
      endDate
      startDate
      
    }
  }
`
export const GET_TEAMS = gql`
  query GetTeams($sport: String!) {
    getTeams(sport: $sport) {
      key
      name
    }
}
`

export const GET_NBA_PLAYER_SCHEDULE = gql`
  query GetNbaPlayerSchedule($team: String!, $startDate: DateTime!, $endDate: DateTime!){
    getNbaPlayerSchedule(team: $team, startDate: $startDate, endDate: $endDate){
      homeTeam
      awayTeam
      dateTimeUTC
    }
  }
`