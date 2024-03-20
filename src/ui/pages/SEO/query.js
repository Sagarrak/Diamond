import gql from "graphql-tag";

export const GET_SEO_CONTENT = gql`
query GetSEOContent {
  getSEOContent {
    id
    title
    content
    tags {
      label
      url
    }
  }
}
`;  