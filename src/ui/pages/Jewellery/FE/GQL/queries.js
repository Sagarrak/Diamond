import gql from "graphql-tag";

export const JewelryCategories = gql`
query Query {
  jewelryCategoriesWithoutPaginations {
    createdBy
    id
    image
    isActive
    name
    sortIndex
    title
    updatedBy
  }
}
`