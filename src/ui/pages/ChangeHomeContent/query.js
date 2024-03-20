import gql from "graphql-tag";

export const GET_HOME_PAGE_CONTENT = gql`
query Query {
  getHomepageContent {
    id
    leftImage
    rightImage
    header
    content
    buttonText
    buttonLink
  }
}
`