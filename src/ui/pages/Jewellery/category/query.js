import gql from 'graphql-tag'
export const GET_ALL_JEWELLERY_CATEGORY=gql`
query JewelryCategories($page: Int, $limit: Int, $sort: Sort, $filter: String) {
  jewelryCategories(page: $page, limit: $limit, sort: $sort, filter: $filter) {
    count
    data {
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
}
`

