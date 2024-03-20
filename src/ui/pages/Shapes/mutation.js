import gql from "graphql-tag";

export const DELETE_SHAPE = gql`
mutation DeleteShape($deleteShapeId: ID) {
  deleteShape(id: $deleteShapeId)
}
`;

export const UPDATE_SHAPE = gql`
mutation UpdateShape($input: updateShapeInput) {
  updateShape(input: $input) {
    status
    message
    shape {
      id
      shapeName
      alias
      description
      isCertified
      isCommon
      categoryId
      shapeImage
      sortOrder
    }
  }
}
`;

export const ADD_SHAPE = gql`
mutation AddShape($input: shapeInput) {
  addShape(input: $input) {
    status
    message
    shape {
      id
      shapeName
      alias
      description
      isCertified
      isCommon
      categoryId
      shapeImage
      sortOrder
    }
  }
}
`;
