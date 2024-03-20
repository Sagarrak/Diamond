import gql from "graphql-tag";

export const ACCEPT_INVOICE = gql`
mutation AcceptInvoice($invoiceNo: String!, $acceptStatus: String!) {
    acceptInvoice(invoiceNo: $invoiceNo, acceptStatus: $acceptStatus) {
    status
    message
    invoice {
    id
    userEmail
    userName
    userId
    notes
    productStatus
    acceptStatus
    createdAt
    updatedAt
    }
    }
    }
`
export const MAKE_PAYMENT=gql`
mutation MakePayment($input: paymentInput) {
  makePayment(input: $input) {
    message
    status
  }
}
`

export const REUPLOAD_SLIP=gql`
mutation ReUploadPaymentSlip($input: paymentInput) {
  reUploadPaymentSlip(input: $input) {
    message
    status
  }
}
`