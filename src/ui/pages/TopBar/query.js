import { gql } from "graphql-tag";

export const GET_TOPBAR = gql`
query Query {
  getTopBar {
    id
    topBar
    content
  }
}
`