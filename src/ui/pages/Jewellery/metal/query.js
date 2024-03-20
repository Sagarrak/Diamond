import gql from 'graphql-tag'
export const GET_ALL_METAL=gql`
query Query($page: Int, $limit: Int, $sort: Sort) {
  getMetal(page: $page, limit: $limit, sort: $sort) {
    count
    data {
      id
      metalName
      image
      sortIndex
      isActive
    }
  }
}
`
