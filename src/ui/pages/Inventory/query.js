import gql from "graphql-tag";

export const GET_COUPLE_PRODUCTS = gql`
query GetCouplesByProductId($page: Int, $limit: Int, $filter: String, $sort: productSort, $search: String) {
    getCouplesByProductId(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
    id
    productName
    description
    image
    certificateNumber
    categoryId {
    id
    name
    }
    certificateURL
    isCertified
    video
    shapeId {
    id
    shapeName
    }
    productDetails {
    id
    parameter
    value
    type
    }
    discount
    totalPrice
    labComment
    quantity
    status
    location
    type
    netRate
    netValue
    reportNo
    }
    }
    }
`

export const GET_RELATED_PRODUCTS = gql`
  query RecommendedProducts($relatedText: String) {
  recommendedProducts(relatedText: $relatedText) {
    id
    shapeId {
      id
      shapeName
    }
    productName
    description
    image
    certificateNumber
    categoryId {
      id
      name
      alias
      categoryImage
      hoverImage
      sortOrder
      createdAt
      updatedAt
    }
    certificateURL
    isCertified
    isDefault
    video
    productDetails {
      id
      parameter
      value
      type
    }
    discount
    totalPrice
    labComment
    handle
    quantity
    status
    location
    type
    productOwner
    netRate
    netValue
    vendorNetRate
    vendorDiscount
    vendorNetValue
    reportNo
    pairVideo
    matchingPair
    isExclusiveDesign
    isManualExclusiveDesign
  }
}
`;


export const SUGGESTIONS = gql`
    query Query($search: String, $limit: Int) {
  suggestion(search: $search, limit: $limit)
}
`

export const GET_ADVS = gql`
query GetAdContent {
  getAdContent {
    id
    index
    image
    url
  }
}
`