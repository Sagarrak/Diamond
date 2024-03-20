import gql from "graphql-tag";

export const GET_ASSOCIATE_PARTNERS = gql`
query GetAssociatePartners($page: Int, $limit: Int, $filter: String, $sort: userSort) {
    getAssociatePartners(page: $page, limit: $limit, filter: $filter, sort: $sort) {
      count
      data {
        id
        email
        fullName
        companyName
        userType
        commission
        approvedStatus
        vendorCategory
        isVerified
        isEmailVerified
        isActive
        createdAt
        updatedAt
        iscNo
        incorporateCertificate
        panCard
        aadharCard
      }
    }
  }
`
