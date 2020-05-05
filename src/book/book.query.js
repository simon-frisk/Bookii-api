const {
  getBookDataFromBookId,
  getBooksDataFromQuery,
} = require('../book/bookdata')
const getNyTimesBestSellers = require('./nyTimesBestSellers')
const checkAuth = require('../util/checkAuth')
const userQuery = require('../user/user.query')

module.exports = {
  ...userQuery,
  async book(_, { bookId }, { user }) {
    checkAuth(user)
    return getBookDataFromBookId(bookId)
  },
  async bookSearch(_, { query }, { user }) {
    checkAuth(user)
    return getBooksDataFromQuery(query)
  },
  async nytimesBestSellers(_, { list }, { user }) {
    checkAuth(user)
    return getNyTimesBestSellers(list)
  },
}
