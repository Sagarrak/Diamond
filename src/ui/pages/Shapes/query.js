import gql from "graphql-tag";

export const GET_ALL_SHAPES = gql`
query Query($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
  getAllShapes(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      shapeName
      alias
      description
      isCertified
      isCommon
      categoryId {
        id
        name
        alias
        categoryImage
        hoverImage
        sortOrder
        createdAt
        updatedAt
      }
      sortOrder
      shapeImage
    }
    
  }
}`;

export const GET_SHAPE = gql`
query GetShape($getShapeId: ID) {
  getShape(id: $getShapeId) {
    id
    shapeName
    alias
    description
    isCertified
    sortOrder
    shapeImage
  }
}
`;

export const GET_ALL_CATEGORIES = gql`
query GetAllCategories($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
  getAllCategories(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      name
      createdAt
      updatedAt
    }
  }
}
`