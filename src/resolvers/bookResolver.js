const bookData = require('../data/book/bookData')
const checkAuth = require('../util/checkAuth')
const { doesISBNBookIdsMatch } = require('../util/bookIdUtil')

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
    onselffeed(book, _, { user }) {
      return user.feedBooks
        .filter(feedBook => doesISBNBookIdsMatch(feedBook.bookId, book.bookId))
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
    },
    async onfollowingfeed(book, _, { user }) {
      await user.populate('following').execPopulate()
      return user.following
        .reduce((feedBooks, following) => {
          return following.feedBooks
            .filter(feedBook =>
              doesISBNBookIdsMatch(feedBook.bookId, book.bookId)
            )
            .concat(feedBooks)
        }, [])
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
    },
  },
}
