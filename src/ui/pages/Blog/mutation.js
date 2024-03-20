import gql from "graphql-tag";

export const DELETE_BLOG = gql`
mutation DeleteBlog($deleteBlogId: ID) {
  deleteBlog(id: $deleteBlogId)
}
`;
// mutation DeleteShape($deleteShapeId: ID) {
//   deleteShape(id: $deleteShapeId)
// }

export const UPDATE_BLOG = gql`
mutation UpdateBlog($input: blog) {
  updateBlog(input: $input) {
    status
    message
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

export const ADD_BLOG = gql`
mutation AddBlog($input: blog) {
  addBlog(input: $input) {
    status
    message
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
// mutation AddShape($input: shapeInput) {
//   addShape(input: $input) {
//     status
//     message
//     shape {
//       id
//       shapeName
//       description
//       isCertified
//       shapeImage
//     }
//   }
// }
