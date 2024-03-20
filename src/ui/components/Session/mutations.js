import gql from 'graphql-tag';

// ****************** Authentication Mutations Start ******************

export const FORGOT_PWD = gql`
    mutation ForgotPassword($email: String) {
        forgotPassword(email: $email)
    }`

export const RESET_PWD = gql`
    mutation ResetPassword($resetPasswordId: ID, $code: String, $password: String) {
        resetPassword(id: $resetPasswordId, code: $code, password: $password)
    }`

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            token
            user {
                id
                email
                userName
                companyName
                fullName
                mobile
                userType
                approvedStatus
                gender
                isVerified
                isEmailVerified
                isActive
                profilePicture
                authKey
                commission
                createdBy
                updatedBy
                createdAt
                updatedAt
            }
        }
    }`

export const SIGN_UP = gql`
    mutation SignUp($input: userInput) {
        signUp(input: $input) {
            status
            message
            user {
                id
                email
                userName
                mobile
                fullName
                gender
                isVerified
                isEmailVerified
                isActive
                profilePicture
                createdBy
                updatedBy
            }
        }
    }`

export const SIGN_IN_WITH_MOBILE = gql`
    mutation LoginInWithMobile($mobile: Number!) {
        LoginInWithMobile(mobile: $mobile) {
            token
            user {
                id
                email
                userName
                companyName
                fullName
                mobile
                userType
                approvedStatus
                gender
                isVerified
                isEmailVerified
                isActive
                profilePicture
                createdAt
                updatedAt
            }
        }
    }`

export const VERIFY_EMAIL = gql`
    mutation VerifyEmail($userId: ID, $code: String) {
        verifyEmail(userId: $userId, code: $code)
    }`

export const RESEND_EMAIL = gql`
    mutation ResendVerificationEmailLink($email: String $userId: ID) {
        resendVerificationEmailLink(email: $email userId:$userId)
    }`

// ****************** Authentication Mutations End ******************

// ****************** Cart Mutations Start ******************

export const ADD_TO_CART = gql`
    mutation AddToCart($input: [cartInput]) {
  addToCart(input: $input) {
     data {
  id
  items {
    itemId
    quantity
    carat
  }
  createdBy
  }
  message
  status
  }
}
    `

export const SEND_ENQUIRY = gql`
    mutation Mutation($exchangeRate: Number, $currency: String, $symbol: String) {
    addEnquiry(exchangeRate: $exchangeRate, currency: $currency, symbol: $symbol)  {
          status
          message
          data {
            items {
              quantity
              subTotal
              discount
              itemId
            }
            proformaInvoiceUrl
            grandTotal
            createdBy
            status
            id
          }
        }
       }`

export const DELETE_PRODUCT = gql`
mutation DeleteFromCart($deleteFromCartId: ID) {
    deleteFromCart(id: $deleteFromCartId)
  }
`

// ****************** Cart Mutations End ******************