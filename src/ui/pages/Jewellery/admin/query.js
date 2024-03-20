import gql from "graphql-tag"
export const GET_ALL_RING_STYLE_DATA = gql`
query GetStyle($page: Int, $limit: Int, $sort: Sort) {
  getStyle(page: $page, limit: $limit, sort: $sort) {
    count
    data {
      categoryId {
        name
        id
      }
      id
      image
      index
      isActive
      styleName
    }
  }
}
`

export const JEWELLERY_CATEGORIES = gql`
query jewelryCategoriesWithoutPaginations {
 jewelryCategoriesWithoutPaginations {
    id
    name
    image
    title
    sortIndex
    isActive
    createdBy
    updatedBy
  }
}
`