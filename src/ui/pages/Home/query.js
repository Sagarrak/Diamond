import gql from "graphql-tag";

export const GET_ALL_WHISH_LIST = gql`

query GetWishlist($page: Int, $limit: Int, $sort: Sort) {
  getWishlist(page: $page, limit: $limit, sort: $sort) {
    count
    data {
      id
      items {
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
            vendorPricePerCarat
            reportNo
            pairVideo
            matchingPair
            createdBy
            updatedBy
            isView
            default
            isExclusiveDesign
            isManualExclusiveDesign
          }
          createdBy
          updatedBy
          isView
          default
          isExclusiveDesign
          isManualExclusiveDesign
        }
        quantity
        carat
      }
      createdAt
      updatedAt
    }
  }
}

`

export const ORDER_NOTIFICATIONS = gql`
subscription Subscription {
  orderStatusChange
}
`