const { getBookDataFromBookId } = require('../util/bookdata')
const { isBookIdTypeISBN } = require('../util/bookIdUtil')
const { ApolloError } = require('apollo-server')

module.exports = {
  async book(userFeedBook) {
    return getBookDataFromBookId(userFeedBook.bookId)
  },
}
