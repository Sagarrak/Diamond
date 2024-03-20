import gql from "graphql-tag";

export const GET_ALL_INVOICES = gql`
query GetAllInvoices($page: Int, $limit: Int, $filter: String, $sort: invoiceSort, $search: String) {
  getAllInvoices(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
  count
  data {
  id
  acceptStatus
  invoiceNo
  productStatus
  userEmail
  userName
  totalAmount
  userId {
  id
  email
  fullName
  mobile
  profilePicture
  }
  invoiceProducts {
  id
  productName
  quantity
  discount
  price
  status
  total
  productId {
  id
  productName
  description
  image
  shapeId {
  id
  shapeName
  description
  isCertified
  shapeImage
  }
  productDetails {
  id
  parameter
  value
  type
  }
  discount
  totalPrice
  labComment
  quantity
  }
  }
      invoiceUrl
      isPaymentApprovedByAdmin
      isPaymentDoneByUser
      paymentSlip
      productStatus
      subTotal
      totalAmount
      orderTrackingStatus
      notes
  }
  }
  }
`;


