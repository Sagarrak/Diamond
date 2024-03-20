import gql from "graphql-tag";

export const DELETE_PRODUCT = gql`
mutation DeleteProduct($deleteProductId: ID) {
  deleteProduct(id: $deleteProductId)
}
`;

export const UPDATE_PRODUCT = gql`
mutation Mutation($input: productUpdateInput) {
  updateProduct(input: $input) {
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
        alias
        categoryImage
        hoverImage
        mobileImage
        sortOrder
        createdAt
        updatedAt
      }
      certificateURL
      isCertified
      isDefault
      video
      DiamondVideoMp4
      SingleDiamondVideoMp4
      shapeId {
        id
        shapeName
        alias
        description
        isCertified
        isCommon
        categoryId
        shapeImage
        sortOrder
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
      handle
      quantity
      status
      location
      country
      state
      city
      type
      productOwner
      owner
      PricePerCarat
      netRate
      netValue
      vendorNetRate
      vendorDiscount
      vendorNetValue
      reportNo
      pairVideo
      matchingPair
     
      isView
      default
      isExclusiveDesign
      isManualExclusiveDesign
    }
    status
  }
}
`;

export const ADD_PRODUCT = gql`
mutation Mutation($input: productInput) {
  addProduct(input: $input) {
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
        alias
        categoryImage
        hoverImage
        mobileImage
        sortOrder
        createdAt
        updatedAt
      }
      certificateURL
      isCertified
      isDefault
      video
      DiamondVideoMp4
      SingleDiamondVideoMp4
      shapeId {
        id
        shapeName
        alias
        description
        isCertified
        isCommon
        categoryId
        shapeImage
        sortOrder
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
      handle
      quantity
      status
      location
      country
      state
      city
      type
      productOwner
      owner
      PricePerCarat
      netRate
      netValue
      vendorNetRate
      vendorDiscount
      vendorNetValue
      reportNo
      pairVideo
      matchingPair
      matchingPairId {
        id
        productName
        description
        image
        certificateNumber
        certificateURL
        isCertified
        isDefault
        video
        DiamondVideoMp4
        SingleDiamondVideoMp4
        discount
        totalPrice
        labComment
        handle
        quantity
        status
        location
        country
        state
        city
        type
        productOwner
        owner
        PricePerCarat
        netRate
        netValue
        vendorNetRate
        vendorDiscount
        vendorNetValue
        reportNo
        pairVideo
        matchingPair
        isView
        default
        isExclusiveDesign
        isManualExclusiveDesign
        productDetails {
                 id
                 parameter
                 value
                 type
             }
                 
      }
      isView
      default
      isExclusiveDesign
      isManualExclusiveDesign
    }
    status
  }
}
`;


export const IMPORT_PRODUCTS = gql`
mutation Mutation($input: [JSON!]!, $categoryId: ID!, $commissionType: String,$owner:String,$isRemoveAll:Boolean) {
  importProducts(input: $input, categoryId: $categoryId, commissionType: $commissionType,owner:$owner,isRemoveAll:$isRemoveAll)
}
`
export const ADDING_MATCHING_PAIR = gql`
      mutation AddMatchingPair($input: [productInput]) {
      addMatchingPair(input: $input)
}
`
export const UPDATE_MATCHING_PAIR = gql`
mutation UpdateMatchingPair($input: [productInput]) {
updateMatchingPair(input: $input)

}
`