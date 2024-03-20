import gql from "graphql-tag";

export const GET_AD_CONTENT = gql`
query GetAdContent {
  getAdContent {
    id
    index
    gridImage4
    gridImage6
    url
  }
}
`