import gql from "graphql-tag";

export const GET_IMGVIDOPTION = gql`
query Query($page: Number, $limit: Number) {
  getImgVidOption(page: $page, limit: $limit) {
    id
    productID
    image
    video
  }
}
`