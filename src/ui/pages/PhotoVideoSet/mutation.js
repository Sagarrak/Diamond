import gql from 'graphql-tag'

export const ADD_PHOTO_VIDEO=gql`
mutation AddImgVidUpload($input: imgVidUpload) {
  addImgVidUpload(input: $input) {
    id
    url
    createdAt
    updatedAt
    createdBy
    updatedBy
  }
}

`
export const DELETE_PHOTO_VIDEO=gql`
mutation DeleteImgVidUpload($deleteImgVidUploadId: ID) {
  deleteImgVidUpload(id: $deleteImgVidUploadId)
}
`

export const GENERATE_PRESIGNED_PHOTO_VIDEO=gql`
mutation GeneratePreSignedUrl($typeOfFile: String) {
  generatePreSignedUrl(typeOfFile: $typeOfFile) {
    status
    URL
    fileName
  }
}
`