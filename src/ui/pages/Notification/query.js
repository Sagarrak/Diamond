import gql from "graphql-tag";

export const GET_ALL_NOTIFICATIONS = gql`
query GetAllNotifications($page: Int, $limit: Int, $sort: Sort, $filter: String, $search: String) {
  getAllNotifications(page: $page, limit: $limit, sort: $sort, filter: $filter, search: $search) {
    count
    data {
      userId {
        id
        fullName
        email
      }
      id
      message
      status
      updatedAt
      createdAt
      category
    }
  }
}
`