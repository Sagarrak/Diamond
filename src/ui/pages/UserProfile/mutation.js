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
    # country
    # seller
    userType
    approvedStatus
    commission
    gender
    isVerified
    isEmailVerified
    isActive
    profilePicture
    createdBy
    updatedBy
    kycDocument1
    kycDocument2
    kycDocument3
    isKyc
    createdAt
    updatedAt
    }
    }
`