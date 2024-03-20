import gql from "graphql-tag";

export const ADD_CONTACT_US = gql`
mutation AddContactUs($input: contactusInput) {
    addContactUs(input: $input) {
      id
      fullName
      companyName
      email
      mobile
      subject
      message
      createdAt
      updatedAt
    }
  }
`
export const DELETE_FROM_CART = gql`
mutation Mutation($deleteFromCartId: ID) {
    deleteFromCart(id: $deleteFromCartId)
}
  `

export const ADD_ITEM_IN_WHISH_LIST = gql`
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

export const DELETE_WHISH_LIST = gql`  
  mutation RemoveItemFromWishlist($itemId: ID) {
  removeItemFromWishlist(itemId: $itemId) {
      message
      status
      data {
      id
      updatedAt
      items {
      itemId {
      id
      }
      quantity
      carat
      }
      }
      }
  }  
  `

export const UPDATE_CART = gql`  
  mutation UpdateCart($input: [cartInput]) {
  updateCart(input: $input) {
    status
    message
    data {
      id
      items {
        itemId
        quantity
        carat
      }
      createdBy
    }
  }
}`
export const UPDATE_WISHLIST = gql`
mutation UpdateItemInWishlist($input: [wishlistInput]) {
updateItemInWishlist(input: $input) {
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