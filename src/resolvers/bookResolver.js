const {
  getBookDataFromBookId,
  getBooksDataFromQuery,
} = require('../data/bookdata')
const getNytimesBestSellersLists = require('../data/nyTimesBestSellers')
const checkAuth = require('../util/checkAuth')

module.exports = {
  Query: {
    async book(_, { bookId }, { user }) {
      checkAuth(user)
      return getBookDataFromBookId(bookId)
    },
    async bookSearch(_, { query }, { user }) {
      checkAuth(user)
      return getBooksDataFromQuery(query)
    },
    async nytimesBestSellers(_, __, { user }) {
      checkAuth(user)
      return getNytimesBestSellersLists()
    },
  },
}
