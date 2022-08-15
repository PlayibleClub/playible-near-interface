import { gql } from '@apollo/client';

export const CREATE_GAME = gql`
  mutation CreateGame($args: CreateGameArgs!) {
    createGame(args: $args) {
      name
      startTime
      duration
      prize
    }
  }
`;
