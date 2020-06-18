const bookData = require('../data/book/bookData')
const checkAuth = require('../util/checkAuth')

module.exports = {
  Query: {
    async book(_, { bookId }, { user }) {
      checkAuth(user)
      return bookData.getByBookId(bookId)
    },
    async bookSearch(_, { query }, { user }) {
      checkAuth(user)
      return bookData.getByQuery(query)
    },
    async nytimesBestSellers(_, __, { user }) {
      checkAuth(user)
      return bookData.getNYTBestSellers()
    },
  },
}
