import gql from "graphql-tag";

export const UPDATE_BANK_DETAILS=gql`
mutation UpdatebankDetails($input: bankInput) {
  updatebankDetails(input: $input) {
    IFSCCode
    accountNumber
    bankName
    id
  }
}
`