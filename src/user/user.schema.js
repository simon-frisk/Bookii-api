const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    _id: ID!
    email: String!
    name: String!
    feedBooks(bookId: String): [FeedBook!]!
    profilePicture: String
  }

  input SignUpInput {
    email: String!
    name: String!
    password: String!
  }

  input UserUpdateInput {
    email: String
    name: String
    password: String
    profilepicture: Upload
  }
`
