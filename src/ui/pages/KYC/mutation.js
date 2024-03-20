import gql from "graphql-tag";

export const UPDATE_KYC = gql`
mutation UpdateVendor($input: associateInput) {
    updateVendor(input: $input) {
      id
      email
      fullName
      companyName
      userType
      approvedStatus
      aadharCard
      panCard
      incorporateCertificate
      iscNo
      commission
      isVerified
      isEmailVerified
      isActive
      createdBy
      createdAt
      updatedAt
      updatedBy
    }
  }
`