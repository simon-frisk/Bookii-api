const { getBookDataFromBookId } = require('../util/bookdata')

module.exports = {
  async book(userFeedBook) {
    return getBookDataFromBookId(userFeedBook.bookId)
  },
}
