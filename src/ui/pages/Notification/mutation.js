import gql from "graphql-tag";

export const DELETE_NOTIFICATION = gql`
mutation Mutation($deleteNotificationId: ID) {
    deleteNotification(id: $deleteNotificationId)
  }
`