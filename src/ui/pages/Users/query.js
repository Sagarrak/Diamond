import gql from "graphql-tag";

export const GET_ALL_USERS = gql`
  query GetAllUser($page: Int, $limit: Int, $filter: String, $sort: userSort, $search: String) {
    getAllUser(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
      count
      data {
        id
        email
        userName
        fullName
        mobile
        gender
        userType
        isVerified
        isEmailVerified
        isActive
        category
        profilePicture
        createdBy
        updatedBy
        isKyc
        kycDocument1
        kycDocument2
        kycDocument3
        createdAt
        updatedAt
        enableDiscount
      }
    }
  }
`;

export const GET_ASSCOIATE_VENDOR=gql`
query GetAllAssociateVendors {
  getAllAssociateVendors {
    id
    userType
    fullName
  }
}
`


