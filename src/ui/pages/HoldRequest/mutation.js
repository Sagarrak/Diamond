import gql from "graphql-tag";

export const UPDATE_HOLD_REQUEST = gql`

mutation UpdateHoldRequest($input: holdRequestInput) {
    updateHoldRequest(input: $input) {
        id
        itemIds
        status    
        createdAt
        updatedAt
    }
}
`
export const SEND_HOLD_REQUEST = gql`
mutation SendHoldRequest($input: holdRequestInput) {
    sendHoldRequest(input: $input) {
        id
        itemIds
        status
        createdAt
        updatedAt
    }
}
`

export const DELETE_HOLD_REQUEST = gql`
mutation DeleteHoldRequest($deleteHoldRequestId: ID) {
deleteHoldRequest(id: $deleteHoldRequestId)

}
`
