import gql from 'graphql-tag'

export const GENERATE_PRE_SIGN = gql`
mutation GeneratePreSignURL($folder: String) {
  generatePreSignURL(folder: $folder) {
    url
    path
  }
}
`