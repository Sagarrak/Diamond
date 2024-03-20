import gql from "graphql-tag";

export const GET_ALL_CONTACT_US = gql`
query GetAllContactUs($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
    getAllContactUs(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
      count
      data {
        id
        fullName
        companyName
        mobile
        email
        subject
        message
        createdAt
        updatedAt
      }
    }
  }
`

export const GET_ALL_APPOINTMENTS = gql`
query getAllAppointments($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
    getAllAppointments(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
      count
      data {
        id
        fullName
        companyName
        date
        time
        mobile
        email
        subject
        note
        createdAt
        updatedAt
      }
    }
  }
`