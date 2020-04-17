const { getBookDataFromBookId } = require('../util/bookdata')
const { isBookIdTypeISBN } = require('../util/bookIdUtil')

module.exports = {
  async book(userFeedBook) {
    if (isBookIdTypeISBN(userFeedBook.bookId))
      return getBookDataFromBookId(userFeedBook.bookId)
  },
}
