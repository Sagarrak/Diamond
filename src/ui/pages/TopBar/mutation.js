import { gql } from "graphql-tag";

export const ADD_TOPBAR = gql`
mutation Mutation($input: inputTopBar) {
  addTopBar(input: $input) {
    id
    topBar
    content
  }
}
`

export const UPDATE_TOPBAR = gql`
mutation UpdateTopBar($input: inputTopBar) {
  updateTopBar(input: $input) {
    id
    topBar
    content
  }
}
`

export const DELETE_TOPBAR = gql`
mutation DeleteTopBar($deleteTopBarId: ID) {
  deleteTopBar(id: $deleteTopBarId)
}
`

