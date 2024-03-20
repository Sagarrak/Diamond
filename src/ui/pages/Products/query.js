import gql from "graphql-tag";

export const GET_ALL_PRODUCTS = gql`
query GetAllProducts($page: Int, $limit: Int, $filter: String, $sort: productSort, $search: String, $noFilter: Boolean) {
getAllProducts(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search, noFilter: $noFilter) {
  count
  data {      
    id
    productName
    createdBy
    description
    image
    certificateNumber
    categoryId {
      id
      categoryImage
      name
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
    vendorPricePerCarat
    reportNo
    pairVideo
    matchingPair
    matchingPairId {
        
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
      isDefault
      video
      DiamondVideoMp4
      SingleDiamondVideoMp4
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
      shapeId {
        id
        shapeName
      }
    }
    isView
    default
    isExclusiveDesign
    isManualExclusiveDesign
  }
}
}
`;

export const GET_PRODUCT = gql`
query Query($getProductId: ID, $handle: String) {
  getProduct(id: $getProductId, handle: $handle) {
    id
    productName
    isView
    description
    image
    certificateNumber
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
      categoryId {
        id
        name
        alias
        categoryImage
        hoverImage
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
      default
      isExclusiveDesign
      isManualExclusiveDesign
    }
    default
    isExclusiveDesign
    isManualExclusiveDesign
    categoryId {
      id
      name
      alias
      categoryImage
      hoverImage
      sortOrder
      createdAt
      updatedAt
    }
  }
}
`;


export const GET_COMPARE_PRODUCTS = gql`
query GetCompareProducts($getCompareProductsId: [ID]) {
  getCompareProducts(id: $getCompareProductsId) {
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
    PricePerCarat
    netRate
    netValue
    vendorNetRate
    vendorDiscount
    vendorNetValue
    reportNo
    pairVideo
    matchingPair
    owner
    isExclusiveDesign
    isManualExclusiveDesign
  }
}

`

export const GET_ALL_SHAPE = gql`
query GetAllShapes($page: Int, $limit: Int, $filter: String, $sort: Sort) {
  getAllShapes(page: $page, limit: $limit, filter: $filter, sort: $sort) {
    count
    data {
      id
      shapeName
      sortOrder
      description
      isCertified
      shapeImage
    }
  }
}
`;

export const GET_ALL_CATEGORIES = gql`
query GetAllCategories($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
  getAllCategories(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      name
      alias
      categoryImage 
      hoverImage  
    }
  }
}
`

export const GET_ALL_VENDORS = gql`
query GetAllAssociateVendors {
  getAllAssociateVendors {
    id
    email
    fullName
    companyName
    userType
    approvedStatus
    aadharCard
    panCard
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
`