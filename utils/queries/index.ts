import { gql } from "@apollo/client"

export const GET_ATHLETEDATA_QB = gql
  `query GetAthleteData_QB($getAthleteByIdId: Float!) {
      getAthleteById(id: $getAthleteByIdId) {
        id
        firstName
        lastName
        position
        nftImage
        stats {
          completion
          passingYards
          passingTouchdowns
          interceptions
          carries      
          rushingYards
          rushingTouchdowns
        }
      }
    }`;

export const GET_ATHLETEDATA_RB = gql
  `query GetAthleteData_RB($getAthleteByIdId: Float!) {
      getAthleteById(id: $getAthleteByIdId) {
        id
        firstName
        lastName
        position
        nftImage
        stats {
          carries
          rushingYards
          rushingTouchdowns
          targets
          receptions
          receivingYards
          receivingTouchdowns
        }
      }
    }`;

export const GET_ATHLETEDATA_WR = gql
  `query GetAthleteData_WR($getAthleteByIdId: Float!) {
      getAthleteById(id: $getAthleteByIdId) {
        id
        firstName
        lastName
        position
        nftImage
        stats {
          targets
          receptions
          receivingYards
          receivingTouchdowns
        }
      }
    }`;

export const GET_ATHLETEDATA_TE = gql
  `query GetAthleteData_TE($getAthleteByIdId: Float!) {
      getAthleteById(id: $getAthleteByIdId) {
        id
        firstName
        lastName
        position
        nftImage
        stats {
          targets
          receptions
          receivingYards
          receivingTouchdowns
        }
      }
    }`;