import gql from 'graphql-tag'
export const ADD_METAL_DATA=gql`
mutation CreateMetal($input: metalInput) {
  createMetal(input: $input) {
    id
    metalName
    image
    sortIndex
    isActive
  }
}
`

export const UPDATE_METAL_DATA=gql`
mutation UpdateMetal($input: metalInput) {
  updateMetal(input: $input) {
    id
    image
    isActive
    metalName
    sortIndex
  }
}
`
export const DELETE_METAL_DATA=gql`
mutation DeleteMetal($deleteMetalId: ID) {
  deleteMetal(id: $deleteMetalId)
}
`