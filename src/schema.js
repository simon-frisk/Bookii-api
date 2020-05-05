const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    signin(email: String!, password: String!): String!
    user(userId: ID): User
    book(bookId: String!): Book
    bookSearch(query: String!): [Book!]!
    nytimesBestSellers: [BookList!]!
  }

  type Mutation {
    signup(user: SignUpInput!): String!
    updateUser(user: UserUpdateInput!): User!

    addFeedBook(bookId: String!, comment: String!, date: String!): FeedBook!
    removeFeedBook(_id: ID!): FeedBook!
    updateFeedBook(_id: ID!, comment: String, date: String): FeedBook!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    feedBooks(bookId: String, _id: ID): [FeedBook!]!
    profilePicturePath: String
  }

  type FeedBook {
    _id: ID!
    bookId: String!
    comment: String!
    date: String!
    book: Book
  }

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

  type BookList {
    name: String!
    books: [Book!]!
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
    profilePicture: Upload
  }
`
