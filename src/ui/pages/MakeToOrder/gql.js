import gql from "graphql-tag";

export const GET_ALL_MAKE_TO_ORDER = gql`
query GetAllMakeToOrders($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
  getAllMakeToOrders(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      shape 
      color
      image
      clarity
      size
      firstName
      lastName
      phoneNo
      email
      measurement
      companyName
      country
      notes
      isActive
      isDeleted
      createdBy
      updatedBy
    }
  }
}
`

export const DELETE_MAKE_TO_ORDER = gql`
      mutation Mutation($deleteMakeToOrderId: ID) {
    deleteMakeToOrder(id: $deleteMakeToOrderId)
  }
`