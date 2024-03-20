import gql from "graphql-tag";

export const ADD_INVOICE = gql`
mutation AddInvoice($input: invoiceInput) {
  addInvoice(input: $input) {
    status
    message
    invoice {
      id
      userEmail
      userName
      invoiceProducts {
        id
        productName
        quantity
        discount
        price
        productId
      }
      userId
      notes
    }
  }
}
`;

export const SEND_HOLD_REQUEST = gql`
mutation SendHoldRequest($input: holdRequestInput) {
sendHoldRequest(input: $input) {
id
itemIds
status
createdAt
updatedAt
}
}
`

