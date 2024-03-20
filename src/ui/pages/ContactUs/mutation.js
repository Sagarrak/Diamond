import gql from "graphql-tag";

export const DELETE_CONTACT_US = gql`
  mutation Mutation($deleteContactUsId: ID) {
    deleteContactUs(id: $deleteContactUsId)
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation deleteAppointment($deleteAppointmentId: ID) {
    deleteAppointment(id: $deleteAppointmentId)
  }
`;
