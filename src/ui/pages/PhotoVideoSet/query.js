import gql from 'graphql-tag'
export const GET_ALL_PHOTO_VIDEO=gql`
query GetImgVid($page: Int, $limit: Int, $sort: Sort) {
  getImgVid(page: $page, limit: $limit, sort: $sort) {
    count
    data {
      id
      url
      createdBy {
        userName
      }
      updatedBy {
        userName
        
      }
      createdAt
      updatedAt
    }
  }
}
`