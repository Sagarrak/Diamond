import gql from "graphql-tag";

export const SEND_NOTIFICATION = gql`
mutation Mutation($input: notificationInput) {
    addNotification(input: $input) {
      id
      email
      createdAt
      updatedAt
    }
  }
`