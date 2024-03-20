import gql from 'graphql-tag'

export const GET_ALL_JEWELLERY_PRODUCT=gql`
query GetAllJewelryProducts($page: Int, $limit: Int, $sort: Sort, $filter: String) {
  getAllJewelryProducts(page: $page, limit: $limit, sort: $sort, filter: $filter) {
    count
    data {
      id
      productName
      quantity
      price
      backing
      description
      styleId {
        id
        styleName
        image       
        index
        isActive
      }
      categoryId {
          id
          name
          image
          title
          sortIndex
          isActive
          createdBy
          updatedBy
        }
      metalName
      width
      length
      isRhodium
      productImages
      diamondShape
      diamondCarat
      diamondColor
      diamondClarity
      createdBy
      updatedBy
      isActive
    }
  }
}
`

export const GET_ALL_STYLE_BY_CATEGORY=gql`
query GetAllStyleByCategory($getAllStyleByCategoryId: ID) {
  getAllStyleByCategory(id: $getAllStyleByCategoryId) {
    id
    styleName
    image
    categoryId {
      id
      name
      image
      title
      sortIndex
      isActive
      createdBy
      updatedBy
    }
    index
    isActive
  }
}
`

export const GET_JEWELLERY=gql`
query GetJewellery($getJewelleryId: ID) {
  getJewellery(id: $getJewelleryId) {
    id
    productName
    description
    styleId {
      id
      styleName
    }
    categoryId {
      id
      name
    }
    metalName
    width
    length
    price
    backing
    quantity
    isRhodium
    productImages
    diamondShape
    diamondCarat
    diamondColor
    diamondClarity
    createdBy
    updatedBy
    isActive
  }
}
`