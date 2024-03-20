import gql from "graphql-tag";

export const DELETE_INVOICE = gql`
mutation DeleteInvoice($deleteInvoiceId: ID) {
  deleteInvoice(id: $deleteInvoiceId)
}
`;

export const UPDATE_INVOICE_PRODUCT_STATUS = gql`
mutation UpdateInvoiceProductStatus($input: invoiceStatusInput) {
  updateInvoiceProductStatus(input: $input) {
  status
  message
  invoice {
  id
  userEmail
  userName
  userId
  notes
  productStatus
  invoiceProducts {
  id
  productName
  quantity
  discount
  price
  productId
  status
  total
  }
  createdAt
  updatedAt
  }
  }
  }
`

export const ManagePaymentStatusByAdmin = gql`
mutation ManagePaymentStatusByAdmin($status: String!, $rejectionMessage: String, $invoiceId: String!) {
  managePaymentStatusByAdmin(status: $status, rejectionMessage: $rejectionMessage, invoiceId: $invoiceId) {
    message
    status
  }
}
`

export const ManageOrderTrackingStatus = gql`
mutation ManageOrderTrackingStatus($invoiceId: String, $status: String) {
  manageOrderTrackingStatus(invoiceId: $invoiceId, status: $status) {
    message
    status
  }
}
`