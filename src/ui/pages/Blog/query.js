import gql from "graphql-tag";

export const GET_ALL_BLOG = gql`
query Query($page: Int, $limit: Int) {
  getBlogs(page: $page, limit: $limit) {
    count
    data {
      id
      title
      image
      content
      isActive
      createdAt
    }
  }
}`;

export const GET_BLOG = gql`
query Query($getBlogId: ID) {
  getBlog(id: $getBlogId) {
    status
    blog {
      id
      title
      image
      content
      isActive
      createdAt
    }
  }
}
`;
