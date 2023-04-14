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

export const GET_CRICKET_ATHLETES_TOP = gql`
  query getCricketAthleteAvgFantasyScore($args: GetAthletesArgs) {
    getCricketAthleteAvgFantasyScore(args: $args) {
      id
      name
      seasonalRole
      jerseyName
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
`;

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
        opponent {
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
        opponent {
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
        opponent {
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
        opponent {
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
        opponent {
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_ATHLETEDATA_PITCHER = gql`
  query GetAthleteData_PITCHER($getAthleteById: Float!, $season: String!) {
    getAthleteById(id: $getAthleteById, season: $season) {
      id
      firstName
      lastName
      position
      isInjured
      isActive
      nftImage
      stats {
        type
        wins
        earnedRunAverage
        walksHitsPerInningsPitched
        strikeouts
        saves
        played
        opponent {
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_ATHLETEDATA_HITTER = gql`
  query GetAthleteData_HITTER($getAthleteById: Float!, $season: String!) {
    getAthleteById(id: $getAthleteById, season: $season) {
      id
      firstName
      lastName
      position
      isInjured
      isActive
      nftImage
      stats {
        type
        runs
        battingAverage
        homeRuns
        runsBattedIn
        stolenBases
        played
        opponent {
          name
        }
        gameDate
      }
    }
  }
`;

export const GET_ATHLETEDATA_BOWL = gql`
  query GetAthleteMatchResults($playerKey: String!, $matchKey: String!) {
    getAthleteMatchResults(playerKey: $playerKey, matchKey: $matchKey) {
      stats {
        bowling_balls
        bowling_runs
        wickets
        bowling_average
        economy
        bowling_strike_rate
        four_wickets
        five_wickets
      }
    }
  }
`;

export const GET_ATHLETEDATA_WK = gql`
  query GetAthleteMatchResults($playerKey: String!, $matchKey: String!) {
    getAthleteMatchResults(playerKey: $playerKey, matchKey: $matchKey) {
      stats {
        catches
        stumpings
      }
    }
  }
`;

export const GET_ATHLETEDATA_BAT = gql`
  query GetAthleteMatchResults($playerKey: String!, $matchKey: String!) {
    getAthleteMatchResults(playerKey: $playerKey, matchKey: $matchKey) {
      stats {
        matches
        not_outs
        batting_runs
        high_score
        batting_average
        batting_balls
        batting_strike_rate
        hundreds
        fifties
        fours
        sixes
      }
    }
  }
`;

export const GET_SPORT_CURRENT_SEASON = gql`
  query GetSportCurrentSeason($sport: String!) {
    getSportCurrentSeason(sport: $sport) {
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
`;
export const GET_TEAMS = gql`
  query GetTeams($sport: String!) {
    getTeams(sport: $sport) {
      key
      name
    }
  }
`;

export const GET_PLAYER_SCHEDULE = gql`
  query GetPlayerSchedule(
    $team: String!
    $startDate: DateTime!
    $endDate: DateTime!
    $sport: String!
  ) {
    getPlayerSchedule(team: $team, startDate: $startDate, endDate: $endDate, sport: $sport) {
      homeTeam
      awayTeam
      dateTimeUTC
    }
  }
`;
