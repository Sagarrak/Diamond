import gql from "graphql-tag";

export const GET_ALL_EXCLUSIVE_DESIGNS = gql`
query GetAllExclusiveDesigns($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
  getAllExclusiveDesigns(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      productName
      description
      image
      certificateNumber      
      certificateURL
      isCertified
      video      
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
      status
      location
      type
      productOwner
      netRate
      netValue
      vendorNetRate
      vendorDiscount
      vendorNetValue
      reportNo
      isExclusiveDesign
    }
  }
}
    

`