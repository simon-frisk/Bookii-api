const { getBookDataFromBookId } = require('../util/bookdata')
const { isBookIdTypeISBN } = require('../util/bookIdUtil')
const { ApolloError } = require('apollo-server')

module.exports = {
  async book(userFeedBook) {
    if (isBookIdTypeISBN(userFeedBook.bookId))
      return getBookDataFromBookId(userFeedBook.bookId)
    else throw new ApolloError('Failed to get book data')
  },
}
