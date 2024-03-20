import gql from 'graphql-tag'

export const JEWELLERY_DIAMOND_WITHOUT_PAGINATION=gql`
query GetAllJewelryShapesWithoutPagination {
  getAllJewelryShapesWithoutPagination {
    id
    shapeName
    jewelryShapeImage
  }
}
`
export const GET_ALL_JEWELLERY_SETTINGS=gql`
query GetAllJewelrySettings($page: Int, $limit: Int, $sort: Sort, $filter: String) {
  getAllJewelrySettings(page: $page, limit: $limit, sort: $sort, filter: $filter) {
    count
    data {
      id
      name
      styleId {
        id
        styleName
      }
      categoryId {
        id
        name
      }
      width
      length
      metals {
        name
        metalImages
        price
        isDiamonds
        diamondShape {
          diamondId {
            id
            shapeName
          }
          diamondShapeImages
        }
      }
      isActive
    }
  }
}
`