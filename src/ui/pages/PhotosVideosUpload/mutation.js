import { gql } from "graphql-tag";

export const ADD_IMGVIDOPTION = gql`
mutation Mutation($input: imgVidOption) {
  addImgVidOption(input: $input) {
    id
    productID
    image
    video
  }
}
`

export const UPDATE_IMGVIDOPTION = gql`
mutation UpdateImgVidOption($input: imgVidOption) {
  updateImgVidOption(input: $input) {
    id
    productID
    image
    video
  }
}
`

export const DELETE_IMGVIDOPTION = gql`
mutation DeleteImgVidOption($deleteImgVidOptionId: ID) {
  deleteImgVidOption(id: $deleteImgVidOptionId)
}
`