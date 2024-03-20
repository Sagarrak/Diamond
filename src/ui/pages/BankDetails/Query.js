import gql from "graphql-tag";

export const BANK_DETAILS=gql`
query GetAllBankDetails($page: Int, $limit: Int, $filter: String, $sort: Sort) {
  getAllBankDetails(page: $page, limit: $limit, filter: $filter, sort: $sort) {
    count
    data {
      id
      IFSCCode
      accountNumber
      bankName
      createdAt
    }
  }
}
`

