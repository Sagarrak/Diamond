import gql from "graphql-tag";

export const ADD_HOME_PAGE_CONTENT = gql`
mutation Mutation($input: IHomepageContent) {
  addHomepageContent(input: $input) {
    id
    leftImage
    rightImage
    header
    content
    buttonText
    buttonLink
  }
}
`;

export const UPDATE_HOME_PAGE_CONTENT = gql`
mutation Mutation($input: IHomepageContent) {
  updateHomepageContent(input: $input) {
    id
    leftImage
    rightImage
    header
    content
    buttonText
    buttonLink
  }
}
`;

export const DELETE_HOME_PAGE_CONTENT = gql`
mutation DeleteHomepageContent($deleteHomepageContentId: ID) {
  deleteHomepageContent(id: $deleteHomepageContentId)
}
`;