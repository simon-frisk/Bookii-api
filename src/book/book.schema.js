const { gql } = require('apollo-server')

module.exports = gql`
  type Book {
    bookId: String!
    title: String!
    subTitle: String
    description: String
    authors: [String!]
    pages: Int
    publisher: String
    published: String
    thumbnail: String
  }
`
