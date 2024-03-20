import gql from "graphql-tag";

export const ADD_AD_CONTENT = gql`
mutation Mutation($input: adContent) {
  addAdContent(input: $input) {
    id
    index
    gridImage4
    gridImage6
    url
  }
}
`

export const UPDATE_AD_CONTENT = gql`
mutation UpdateAdContent($input: adContent) {
  updateAdContent(input: $input) {
    id
    index
    gridImage4
    gridImage6
    url
  }
}
`

export const DELETE_AD_CONTENT = gql`
mutation Mutation($deleteAdContentId: ID) {
  deleteAdContent(id: $deleteAdContentId)
}
`