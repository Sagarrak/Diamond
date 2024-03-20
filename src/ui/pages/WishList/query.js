import gql from "graphql-tag";
export const GET_ALL_WHISTLIST = gql`

query GetWishlist($page: Int, $limit: Int,$sort: Sort) {
    getWishlist(page: $page, limit: $limit,sort: $sort) {
    count
    data {
        id
        itemIds {
        id
        productName
        description
        image
        netValue
        productDetails{
            id
            parameter
            value
        }
        shapeId {
            id
            shapeName
        }
        }
        createdAt
        updatedAt
    }
    }
}

`