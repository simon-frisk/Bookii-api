const {
  getBookDataFromBookId,
  getBooksDataFromQuery,
} = require('../book/bookdata')
const getNytimesBestSellersLists = require('./nyTimesBestSellers')
const checkAuth = require('../util/checkAuth')
const userQuery = require('../user/user.query')

module.exports = {
  ...userQuery,
  async book(_, { bookId }, { user }) {
    checkAuth(user)
    return getBookDataFromBookId(bookId)
  },
  async bookSearch(_, { query, page }, { user }) {
    checkAuth(user)
    return getBooksDataFromQuery(query, page)
  },
  async nytimesBestSellers(_, __, { user }) {
    checkAuth(user)
    return getNytimesBestSellersLists()
  },
}
