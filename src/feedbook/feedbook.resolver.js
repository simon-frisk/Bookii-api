const { getBookDataFromBookId } = require('../book/bookdata')

module.exports = {
  async book(feedBook) {
    return getBookDataFromBookId(feedBook.bookId)
  },
  async user(feedBook) {
    return feedBook.parent()
  },
}
