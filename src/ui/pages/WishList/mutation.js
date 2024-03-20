import gql from "graphql-tag";
export const ADD_ITEM_IN_WISHLIST = gql`

# mutation AddItemInWishlist($itemIds: [ID!]) {
# addItemInWishlist(itemIds: $itemIds) {
#         id
#         itemIds
#         createdAt
#         updatedAt
#     }
# }
mutation AddItemInWishlist($input: [wishlistInput]) {
addItemInWishlist(input: $input) {
 message
 status
 data {
 id
 items {
 itemId {
 id
 productName
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

export const DELETE_WHISTLIST = gql`
mutation RemoveItemFromWishlist($itemId: ID) {
removeItemFromWishlist(itemId: $itemId) {
        id
        itemIds
        createdAt
        updatedAt
    }
}

`