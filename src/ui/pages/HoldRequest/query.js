import gql from "graphql-tag";

export const GET_ALL_HOLD_REQUEST = gql`
query GetAllHoldRequests($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
getAllHoldRequests(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
count
data {
    id
    itemIds {
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
    status
    location
    type
    productOwner
    netRate
    netValue
    vendorNetRate
    vendorDiscount
    vendorNetValue
    reportNo
    }
    status
    createdBy {
    id
    email
    mobile
    category
    fullName
    }
    createdAt
    updatedAt
    }

}

}

`