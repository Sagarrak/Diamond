export const FormatError = (e) => {
  return e && e.message && e.message.replace('GraphQL error: ', '').replace(/['"]+/g, '')
}