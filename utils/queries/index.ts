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
  query GetCricketAthletes($args: GetAthletesArgs) {
    getCricketAthletes(args: $args) {
      id
      name
      jerseyName
      playerKey
      seasonalRole
      nftImage
      nftAnimation
      stats {
        tournament_points
        fantasyScore
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

export const GET_CRICKET_ATHLETE_BY_ID = gql`
  query GetCricketAthleteById(
    $getCricketAthleteById: Float!
    $team: String
    $from: DateTime
    $to: DateTime
  ) {
    getCricketAthleteById(id: $getCricketAthleteById, team: $team, from: $from, to: $to) {
      id
      name
      playerKey
      seasonalRole
      stats {
        fantasyScore
        match {
          name
          start_at
          status
          key
          team_a {
            name
            key
          }
          team_b {
            name
            key
          }
        }
        type
      }
      nftAnimation
      nftImage
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
  query GetCricketAthleteById($getCricketAthleteById: Float!) {
    getCricketAthleteById(id: $getCricketAthleteById) {
      id
      name
      playerKey
      seasonalRole
      stats {
        type
        cricket_for_every_run
        cricket_for_every_wicket
        cricket_economy_rate
        cricket_strike_rate
        cricket_four_wickets
        cricket_five_wickets
        tournament_points
        match {
          name
          start_at
        }
        id
      }
    }
  }
`;

export const GET_ATHLETEDATA_WK = gql`
  query GetCricketAthleteById($getCricketAthleteById: Float!) {
    getCricketAthleteById(id: $getCricketAthleteById) {
      id
      name
      playerKey
      seasonalRole
      stats {
        cricket_for_every_catch
        cricket_for_every_stumping
        tournament_points
        match {
          name
          start_at
        }
        id
      }
    }
  }
`;

export const GET_ATHLETEDATA_BAT = gql`
  query GetCricketAthleteById($getCricketAthleteById: Float!) {
    getCricketAthleteById(id: $getCricketAthleteById) {
      id
      name
      playerKey
      seasonalRole
      stats {
        type
        cricket_for_every_run
        cricket_strike_rate
        cricket_hundred_runs
        cricket_fifty_runs
        cricket_for_every_four
        cricket_for_every_six
        tournament_points
        match {
          name
          start_at
        }
        id
      }
    }
  }
`;

export const GET_ATHLETEDATA_AR = gql`
  query GetCricketAthleteById($getCricketAthleteById: Float!) {
    getCricketAthleteById(id: $getCricketAthleteById) {
      id
      name
      playerKey
      seasonalRole
      stats {
        type
        cricket_hundred_runs
        cricket_fifty_runs
        cricket_four_wickets
        cricket_five_wickets
        cricket_for_every_catch
        tournament_points
        match {
          name
          start_at
        }
        id
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

export const GET_CRICKET_TEAMS = gql`
  query GetCricketTeams($sport: String!) {
    getCricketTeams(sport: $sport) {
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

export const GET_CRICKET_SCHEDULE = gql`
  query GetCricketTeamSchedule($endDate: DateTime!, $startDate: DateTime!, $team: String!) {
    getCricketTeamSchedule(endDate: $endDate, startDate: $startDate, team: $team) {
      key
      name
      start_at
      team_a {
        name
      }
      team_b {
        name
      }
      status
    }
  }
`;
