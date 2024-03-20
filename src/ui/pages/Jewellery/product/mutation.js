import gql from 'graphql-tag'

export const ADD_PRODUCT_JEWELLERY = gql`
mutation CreateJewelryProduct($input: jewelryProductInput) {
  createJewelryProduct(input: $input) {
    id
    productName
    quantity
    price
    backing
    description
    styleId
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
`

export const UPDATE_PRODUCT_JEWELLERY = gql`
mutation UpdateJewelryProduct($input: jewelryProductInput) {
  updateJewelryProduct(input: $input) {
    id
    productName
    quantity
    price
    backing
    description
    styleId
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
`
export const DELETE_PRODUCT_JEWELLERY = gql`
mutation DeleteJewelryProduct($deleteJewelryProductId: ID) {
  deleteJewelryProduct(id: $deleteJewelryProductId)
}

`