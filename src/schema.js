const { gql } = require('apollo-server-express')

module.exports = gql`
  type Query {
    signin(email: String!, password: String!): String!
    forgotpassword(email: String): Boolean!
    user(_id: ID): User
    userSearch(name: String!): [User!]!
    recommendedUsers: [User!]!
    book(bookId: String!): Book
    bookSearch(query: String!): [Book!]!
    bestSellerLists: [BookList!]!
    bookList(name: String!): BookList!
    categories: [Category!]!
    category(name: String!): Category!
    feed(after: ID): [FeedBook!]!
  }

  type Mutation {
    signup(
      email: String!
      name: String!
      password: String!
      latestConsent: Boolean!
    ): String!
    updateUser(name: String!, email: String!): User!
    changeProfilePicture(profilePicture: Upload): User!
    changePassword(password: String!): Boolean!
    deleteUser: Boolean!

    addFeedBook(
      bookId: String!
      comment: String!
      date: String!
      favorite: Boolean!
    ): FeedBook!
    removeFeedBook(_id: ID!): FeedBook!
    updateFeedBook(
      _id: ID!
      comment: String!
      date: String!
      favorite: Boolean!
    ): FeedBook!

    addWishBook(bookId: String!): String
    removeWishBook(bookId: String!): String

    follow(_id: ID!): User!
    unfollow(_id: ID!): User!
    toggleinappropriateflagged(_id: ID!): User!

    acceptLatestPolicies: Boolean!
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
    subtitle: String
    authors: [String!]
    categories: [Category!]
    description: String
    pages: Int
    published: String
    thumbnail: String
    wikipediadescription: String
    youtubevideos: [String!]!
    onselffeed: [FeedBook!]!
    onfollowingfeed: [FeedBook!]!
    isWished: Boolean!
  }

  type BookList {
    name: String!
    icon: String!
    books: [Book!]!
  }

  type Category {
    name: String!
    icon: String!
    books: [Book!]!
  }
`
