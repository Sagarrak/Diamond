import gql from 'graphql-tag'
export const ADD_JEWELLERY_CATEGORY=gql`
mutation CreateJewellerCategory($input: jewelryCategoryInput) {
  createJewelryCategory(input: $input) {
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

export const UPDATE_JEWELLERY_CATEGORY=gql`
mutation UpdateJewellerCategory($input: jewelryCategoryInput) {
  updateJewelryCategory(input: $input) {
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

export const DELETE_JEWELLERY_CATEGORY=gql`
mutation DeleteJewellerCategory($deleteJewelryCategoryId: ID!) {
  deleteJewelryCategory(id: $deleteJewelryCategoryId)
}
`
