import gql from "graphql-tag"
export const ADD_RING_STYLE_DATA=gql`
mutation CreateStyle($input: styleInput) {
  createStyle(input: $input) {
    id
    styleName
    image
    categoryId
    index
    isActive
  }
}
`
export const UPDATE_RING_STYLE=gql`
mutation UpdateStyle($input: styleInput) {
  updateStyle(input: $input) {
    id
    styleName
    image
    categoryId
    index
    isActive
  }
}
`
export const DELETE_RING_STYLE=gql`
mutation DeleteStyle($deleteStyleId: ID) {
  deleteStyle(id: $deleteStyleId)
}
`