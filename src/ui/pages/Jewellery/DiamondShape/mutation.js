import gql from 'graphql-tag'

export const DELETE_SHAPE_JEWELLERY = gql`
mutation DeleteShape($deleteShapeId: ID, $isJewelry: Boolean) {
  deleteShape(id: $deleteShapeId, isJewelry: $isJewelry)
}
`