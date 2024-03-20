import gql from "graphql-tag";

export const UPDATE_USER = gql`
  mutation UpdateUser($input: userInput) {
    updateUser(input: $input) {
      id
      email
      userName
      companyName
      fullName
      mobile
      userType
      category
      approvedStatus
      gender
      isVerified
      isEmailVerified
      isActive
      isKyc
      kycDocument1
      kycDocument2
      kycDocument3
      profilePicture
      createdBy
      updatedBy
      createdAt
      updatedAt
      enableDiscount
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId)
  }
`;
