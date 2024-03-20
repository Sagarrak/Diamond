import gql from "graphql-tag";

export const ADD_SEO_CONTENT = gql`
mutation AddSEOContent($input: inputSEO) {
  addSEOContent(input: $input) {
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

export const UPDATE_SEO_CONTENT = gql`
mutation Mutation($input: inputSEO) {
  updateSEOContent(input: $input) {
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

export const DELETE_SEO_CONTENT = gql`
mutation Mutation($deleteSeoContentId: ID) {
  deleteSEOContent(id: $deleteSeoContentId)
}
`;