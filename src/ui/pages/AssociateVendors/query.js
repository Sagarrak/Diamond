import gql from "graphql-tag";

export const GET_ASSOCIATE_VENDORS = gql`
query GetAssociateVendors($page: Int, $limit: Int, $filter: String, $sort: userSort, $search: String) {
  getAssociateVendors(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
    count
    data {
      id
      email
      fullName
      companyName
      userType
      approvedStatus
      aadharCard
      commissionType
      panCard
      vendorCategory
      incorporateCertificate
      authKey
      iscNo
      commission
      isVerified
      isEmailVerified
      isActive
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
}
`

export const GET_ALL_HOLD_REQUEST_VENDOR = gql`
query GetVendorHoldRequests($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
getVendorHoldRequests(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
count
    data {
        id
        itemIds {
        id  
        productName
        quantity
        image
        }
        status
        createdBy {
        id
        email
        fullName
        }
        createdAt
        updatedAt
        }
    }
}
`
export const GET_ALL_UPLOAD_HISTORY = gql`
query GetAuditLogs($page: Int, $limit: Int, $filter: String, $sort: Sort, $search: String) {
getAuditLogs(page: $page, limit: $limit, filter: $filter, sort: $sort, search: $search) {
count
data {
    id
    action
    actionId
    actionOn
    actionName
    actor {
        id {
            id
            email
            fullName
            mobile
        }
     email
        }
oldValue
newValue
createdAt
updatedAt
}
}
}
`
export const GET_ALL_VENDOR_ORDER_HISTORY = gql`
query GetVendorOrderHistories($page: Int, $limit: Int, $filter: String, $sort: Sort,$search: String) {
  getVendorOrderHistories(page: $page, limit: $limit, filter: $filter, sort: $sort,search: $search) {
    count
    data {
      product {
        productName
        image
        netValue
        quantity
      }
      userEmail
      userName
      createdAt
      status
      proformaInvoiceUrl
    }
  }

}

`
export const GET_ALL_NOTIFICATION=  gql`
query GetAllNotifications($page: Int, $limit: Int, $sort: Sort, $search: String, $filter: String) {
  getAllNotifications(page: $page, limit: $limit, sort: $sort, search: $search, filter: $filter) {
    count
    data {
      id
      message
      status
      userId {
        id
        fullName
      }
    }
  }
}
`
export const GET_NOTIFICATION_WITHOUT_PAGINATION=gql`
query GetAllNotificationsWithoutPagination($getAllNotificationsWithoutPaginationId: ID) {
  getAllNotificationsWithoutPagination(id: $getAllNotificationsWithoutPaginationId) {
    id
    message
    category
    status
    createdAt
    updatedAt
  }
}
`
export const GET_SUBSCRIPTION=gql`
subscription Subscription {
  createNotification {
    status
  }
}
`

export const UPDATE_NOTIFICATION=gql`
mutation UpdateNotification($updateNotificationId: ID) {
  updateNotification(id: $updateNotificationId)
}

`
