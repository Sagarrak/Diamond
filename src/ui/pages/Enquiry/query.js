import gql from "graphql-tag";

export const  GET_ALL_ENQUIRIES = gql`
  query GetAllEnquiries($page: Int, $limit: Int, $filter: String, $sort: Sort) {
    getAllEnquiries(page: $page, limit: $limit, filter: $filter, sort: $sort) {
    count
    data {
      id
      enquiryNo
      items {
        quantity
        netAmount
        subTotal
        discountPer
        discount
        carats
        itemId {
          id
          PricePerCarat
          productName
          description
          image
          totalPrice
          shapeId {
            id
            shapeName
          }
          categoryId {
            id
            name
          }
          productDetails {
            id
            parameter
            value
            type
          }
          matchingPairId {
            id
            PricePerCarat
            productName
            categoryId {
              id
              name
            }
              shapeId {
            id
            shapeName
          }
          productDetails {
            id
            parameter
            value
            type
          }
          }
        }
      }
      createdBy {
        email
        userName
        id
        fullName        
      }
      userName
      userEmail
      proformaInvoiceUrl
      status
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
