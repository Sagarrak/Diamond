import gql from "graphql-tag";

export const DELETE_ENQUIRY = gql`
mutation DeleteEnquiry($deleteEnquiryId: ID) {
  deleteEnquiry(id: $deleteEnquiryId)
}
`;

export const DELETE_ENQUIRY_ITEMID=gql`
mutation DeleteEnquiryItemId($deleteEnquiryItemIdId: ID, $itemId: ID) {
  deleteEnquiryItemId(id: $deleteEnquiryItemIdId, itemId: $itemId)
}
`
