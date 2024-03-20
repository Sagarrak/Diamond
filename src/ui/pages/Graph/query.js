import gql from "graphql-tag";

export const GET_PRODUCT_REPORT = gql`
query  getProductReports($filter: String) {
  getProductReports(filter: $filter) {
    color
    clarity
    carats    
    total
  }
}
`;
export const GET_PRODUCT_BY_LAB = gql`
query GetProductsByLab {
  getProductsByLab {
    lab
    total
  }
}
`

