import gql from "graphql-tag";

export const GET_ALL_PARAMETERS = gql`
query GetAllParameter($page: Int, $limit: Int, $filter: String, $sort: Sort,$search: String) {
  getAllParameter(page: $page, limit: $limit, filter: $filter, sort: $sort,search: $search) {
    count
    data {
      id
      paramName
      displayName
      type
      value
      category
      isActive
    }
  }
}
`;

export const GET_PARAMETER = gql`
query GetParameter($getParameterId: ID) {
  getParameter(id: $getParameterId) {
    id
    paramName
    displayName
    type
    value
  }
}
`;
