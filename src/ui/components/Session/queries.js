import gql from 'graphql-tag';

export const GET_ME = gql`
query Me {
  me {
    id
    email
    userName
    companyName
    fullName
    code
    mobile
    userType
    category
    approvedStatus
    commission
    authKey
    gender
    isVerified
    enableDiscount
    isEmailVerified
    isMobileVerified
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
  }
}
`;

export const GET_CART_ITEMS = gql`
query GetCartItems {
  getCartItems {
    createdBy
    id
    items {
      id
      itemId {
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
        }
        isView
        default
        isExclusiveDesign
        isManualExclusiveDesign
      }
      carat
      quantity
    }
  }
}

`
export const GET_EXCLUSIVE_DESIGN = gql`
query GetAllExclusiveDesigns($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
  getAllExclusiveDesigns(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      productName
      description
      image
      certificateNumber
      categoryId {
        id
        name
      }
      certificateURL
      isCertified
      video
      shapeId {
        id
        shapeName
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
      status
      productOwner
      netRate
      netValue
      vendorNetRate
      vendorDiscount
      vendorNetValue
      reportNo
      isExclusiveDesign
      location
      type
      quantity
    }
  }
}
`

export const GET_CURRENCY_EXCHANGE_RATE = gql`
query GetCurrencyExchangeRate($currency: String) {
  getCurrencyExchangeRate(currency: $currency) {
    currency
    exchangeRate
  }
}`