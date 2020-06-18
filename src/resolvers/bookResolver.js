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
  Book: {
    async wikipediadescription(book) {
      const author = book.authors ? book.authors[0] : null
      return bookData.getWikipediaDescription(book.title, author)
    },
  },
}
