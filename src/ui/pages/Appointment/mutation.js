import gql from "graphql-tag";

export const BOOKED_APPOINTMENT = gql`
  mutation CreateAppointment($input: appointmentInput) {
    createAppointment(input: $input) {
      id
      date
      time
      subject
      status
      createdBy
      createdAt
      updatedAt
      note
      email
      mobile
      companyName
      fullName
    }
  }
`;
