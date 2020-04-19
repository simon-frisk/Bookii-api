const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    signin(email: String!, password: String!): String!
    user(userId: ID): User
    book(bookId: String!): Book
    bookQuery(query: String!): [Book!]!
  }

  type Mutation {
    signup(user: SignUpInput!): String!
    addFeedBook(bookId: String!, comment: String!, date: String!): FeedBook!
    removeFeedBook(_id: ID!): FeedBook!
  }
`
