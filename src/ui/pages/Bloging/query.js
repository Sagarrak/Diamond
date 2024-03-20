import { gql } from 'graphql-tag';
export const GET_ALL_BLOGS = gql`

query GetBlogs($page: Int, $limit: Int) {
    getBlogs(page: $page, limit: $limit) {
      count
      data {
        id
        title
        image
        content
        isActive
      }
    }
  }
`

export const GET_BLOG = gql`

query GetBlog($getBlogId: ID) {
  getBlog(id: $getBlogId) {
    status
    message
    blog {
      id
      title
      image
      content
      isActive
    }
  }
}
`