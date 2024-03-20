import gql from "graphql-tag";

export const ADD_PARTNER = gql`
mutation Mutation($input: associateInput) {
  addPartner(input: $input) {
    id
    email
    fullName
    companyName
    userType
    approvedStatus
    aadharCard
    panCard
    vendorCategory
    incorporateCertificate
    authKey
    iscNo
    commission
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

export const UPDATE_PARTNER = gql`
mutation Mutation($input: associateInput) {
  updatePartner(input: $input) {
    id
    email
    fullName
    companyName
    userType
    approvedStatus
    aadharCard
    panCard
    vendorCategory
    incorporateCertificate
    authKey
    iscNo
    commission
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

export const DELETE_PARTNER = gql`
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
