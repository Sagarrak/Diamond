import gql from "graphql-tag";

export const ADD_VENDOR = gql`
  mutation AddVendor($input: associateInput) {
    addVendor(input: $input) {
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
      commissionType
      isVerified
      isEmailVerified
      isActive
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VENDOR = gql`
  mutation UpdateVendor($input: associateInput) {
    updateVendor(input: $input) {
      id
      email
      fullName
      companyName
      userType
      approvedStatus
      commission
      commissionType
      isVerified
      isEmailVerified
      isActive
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_VENDOR = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId)
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($deleteProductId: ID) {
    deleteProduct(id: $deleteProductId)
  }
`;

export const GENERATE_KEY = gql`
  mutation Mutation {
    generateAuthKey
  }
`;

export const DELETE_PRODUCT_BY_ADMIN=gql`
mutation DeleteProductByAdmin($deleteProductByAdminId: ID) {
  deleteProductByAdmin(id: $deleteProductByAdminId)
}
`
