const { gql } = require('apollo-server')

module.exports = gql`
  type FeedBook {
    _id: ID!
    bookId: String!
    book: Book!
    comment: String!
    date: String!
  }
`
