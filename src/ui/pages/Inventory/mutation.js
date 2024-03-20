import gql from "graphql-tag";

export const NOT_CERTIFIED_ATC = gql`
mutation AddNotCertifiedToCart($input: [cartInput]) {
    addNotCertifiedToCart(input: $input) {
    id
    items {
    itemId
    quantity
    }
    createdBy
    }
    }
`

export const SESSION_HOLD_STATUS = gql`
mutation SendHoldRequest($input: holdRequestInput) {
    sendHoldRequest(input: $input) {
    id
    itemIds
    status
    createdAt
    updatedAt
    }
}
`

export const MAKE_TO_ORDER = gql`
mutation Mutation($input: makeToOrderInput) {
  addMakeToOrder(input: $input) {
    id
    shape
    color
    clarity
    size
    firstName
    lastName
    phoneNo
    email
    measurement
    companyName
    country
    notes
    image
    isActive
    isDeleted
    createdBy
    updatedBy
  }
}
`

