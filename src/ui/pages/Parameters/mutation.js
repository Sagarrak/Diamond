import gql from "graphql-tag";

export const DELETE_PARAMETER = gql`
mutation DeleteParameter($deleteParameterId: ID) {
  deleteParameter(id: $deleteParameterId)
}
`;

export const UPDATE_PARAMETER = gql`
mutation UpdateParameter($input: updateParameterInput) {
  updateParameter(input: $input) {
    status
    message
    parameter {
      id
      paramName
      displayName
      type
      value
      category
    }
  }
}
`;

export const ADD_PARAMETER = gql`
mutation AddParameter($input: parameterInput) {
  addParameter(input: $input) {
    status
    message
    parameter {
      id
      paramName
      displayName
      type
      value
      category
    }
  }
}
`;
