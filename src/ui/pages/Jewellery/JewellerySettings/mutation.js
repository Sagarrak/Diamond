import gql from 'graphql-tag'

export const CREATE_JEWELLERY_SETTING = gql`
mutation CreateJewelrySetting($input: jewelrySettingInput) {
  createJewelrySetting(input: $input) {
    id
    name
    metals {
      name
      isDiamonds
      metalImages
      price
      diamondShape {
        diamondId
        diamondShapeImages
      }
    }
    categoryId
    styleId
    width
    length
    isActive
    createdBy
    updatedBy
  }
}
`
export const UPDATE_JEWELLERY_SETTINGS=gql`
mutation UpdateJewelrySetting($input: jewelrySettingInput) {
  updateJewelrySetting(input: $input) {
    id
    name
    metals {
      name
      metalImages
      price
      isDiamonds
      diamondShape {
        diamondId
        diamondShapeImages
      }
    }
    categoryId
    styleId
    width
    length
    isActive
    createdBy
    updatedBy
  }
}
`

export const DELETE_JEWELLERY_SETTINGS=gql`
mutation DeleteJewelrySetting($deleteJewelrySettingId: ID) {
  deleteJewelrySetting(id: $deleteJewelrySettingId)
}
`
