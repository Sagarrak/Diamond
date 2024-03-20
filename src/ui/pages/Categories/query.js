import gql from "graphql-tag";

export const GET_ALL_CATEGORIES = gql`
query GetAllCategories($page: Int, $limit: Int, $filter: String, $sort: Sort) {
  getAllCategories(page: $page, limit: $limit, filter: $filter, sort: $sort) {
    count
    data {
      id
      name
      alias
      categoryImage
      hoverImage
      mobileImage
    }
  }
}
`

