import gql from "graphql-tag";

export const ADD_CATEGORY = gql`
mutation AddCategory($input: categoryInput) {
  addCategory(input: $input) {
    alias
    categoryImage
    createdAt
    hoverImage
    id
    mobileImage
    name
    sortOrder
    updatedAt
  }
}
`
export const UPDATE_CATEGORY = gql`
mutation UpdateCategory($input: categoryInput) {
  updateCategory(input: $input) {
    id
    name
    alias
    categoryImage
    hoverImage
    mobileImage
    sortOrder
    createdAt
    updatedAt
  }
}
`

export const DELETE_CATEGORY = gql`
mutation DeleteCategory($deleteCategoryId: ID) {
  deleteCategory(id: $deleteCategoryId)
}
`