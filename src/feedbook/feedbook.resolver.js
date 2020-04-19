const { getBookDataFromBookId } = require('../book/bookdata')

module.exports = {
  async book(feedBook) {
    return getBookDataFromBookId(feedBook.bookId)
  },
}
