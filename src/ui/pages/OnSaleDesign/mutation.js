import gql from "graphql-tag";

export const ADD_EXCLUSIVE_DESIGN = gql`
mutation AddExclusiveDesign($input: productInput) {
addExclusiveDesign(input: $input) {
    status
    message
    product {
      id
      productName
      description
      image
      certificateNumber
      categoryId {
        name
        createdAt
        updatedAt
      }
      certificateURL
      isCertified
      video
      shapeId {
        id
        shapeName
        description
        isCertified
        categoryId
        shapeImage
      }
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
      location
      status
      type
      netRate
      netValue
      reportNo
    }
    }
  }
`

export const EDIT_EXCLUSIVE_DESIGN = gql`
mutation UpdateExclusiveDesign($input: productUpdateInput) {
  updateExclusiveDesign(input: $input) {
    status
    message
    product {
      id
      productName
      description
      image
      certificateNumber
      categoryId {
        id
        name
        createdAt
        updatedAt
      }
      certificateURL
      isCertified
      video
      shapeId {
        id
        shapeName
        description
        isCertified
        categoryId
        shapeImage
      }
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
      location
      type
      status
      netRate
      netValue
      reportNo
      isExclusiveDesign
    }
  
  }
}
`

export const DELETE_EXCLUSIVE_DESIGN = gql`
mutation Mutation($deleteExclusiveProductId: ID) {
  deleteExclusiveProduct(id: $deleteExclusiveProductId)
}
`