const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    signin(email: String!, password: String!): String!
    user(_id: ID): User
    book(bookId: String!): Book
    bookSearch(query: String!): [Book!]!
    nytimesBestSellers: [BookList!]!
    users: [User!]!
    feed(after: ID): [FeedBook!]!
  }

  type Mutation {
    signup(user: SignUpInput!): String!
    updateUser(user: UserUpdateInput!): User!
    deleteUser: User!

    addFeedBook(
      bookId: String!
      comment: String!
      date: String!
      favorite: Boolean!
    ): FeedBook!
    removeFeedBook(_id: ID!): FeedBook!
    updateFeedBook(
      _id: ID!
      comment: String
      date: String
      favorite: Boolean
    ): FeedBook!

    addWishBook(bookId: String!): String
    removeWishBook(bookId: String!): String

    follow(_id: ID!): User!
    unfollow(_id: ID!): User!
    toggleinappropriateflagged(_id: ID!): Boolean!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    feedBooks(_id: ID): [FeedBook!]!
    wishBooks: [Book]!
    profilePicturePath: String
    following: [User!]!
    followers: [User!]!
    isinappropriateflagged: Boolean!
  }

  type FeedBook {
    _id: ID!
    bookId: String!
    comment: String!
    date: String!
    favorite: Boolean!
    book: Book
    user: User
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
    wikipediadescription: String
    onselffeed: [FeedBook!]!
    onfollowingfeed: [FeedBook!]!
    isWished: Boolean!
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
