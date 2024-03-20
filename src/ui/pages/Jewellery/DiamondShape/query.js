import gql from 'graphql-tag'
export const GET_ALL_JEWELLERY_SHAPE = gql`
query GetAllJewelryShapes($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
  getAllJewelryShapes(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      jewelryShapeImage
      shapeName
      sortOrder
    }
  }
}
`

export const GET_ALL_SHAPE_PAGINATE = gql`
query GetAllShapesWithoutPagination {
  getAllShapesWithoutPagination {
    shapeName
    id
  }
}
`